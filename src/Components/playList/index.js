import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../Shared/utils/useAuth";
import "./css/playList.scss";
import SpotifyWebApi from "spotify-web-api-node";
import PlayListItem from "./playListItem";
import Player from "./player";
import PublicService from "../../Store/public";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});
const publicService = new PublicService();

const PlayList = memo(() => {
  const accessToken = useAuth();
  const [recentSearches, setRecentSearches] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingSong, setPlayingSong] = useState();
  const [lyrics, setLyrics] = useState("");

  const scrollToViewRef = useRef(null);

  const chooseTrack = useCallback((song) => {
    setPlayingSong(song);
    setSearchText("");
    setLyrics("");
  }, []);

  useEffect(() => {
    publicService.getAllSongs().then((res) => {
      if (res.status === "Success") {
        setRecentSearches(res.data);
      }
    });
  }, []);

  useEffect(() => {
    if (!playingSong) return;
    if (playingSong.lyrics) return setLyrics(playingSong.lyrics);

    publicService.getSongLyric({ ...playingSong }).then((res) => {
      setLyrics(res.lyrics);
      publicService.getAllSongs().then((res) => {
        if (res.status === "Success") {
          setRecentSearches(res.data);
        }
      });
    });
  }, [playingSong]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!searchText) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(searchText).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            track_name: track.name,
            track_uri: track.uri,
            track_image_url: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [searchText, accessToken]);

  const recentSearchesControl = useCallback(() => {
    if (!recentSearches) return "";

    return (
      <div className="playList-recentSearches">
        {recentSearches.map((song, i) => {
          const isActive = playingSong?.track_uri === song.track_uri;
          return (
            <PlayListItem
              song={song}
              key={i}
              active={isActive}
              referans={isActive ? scrollToViewRef : undefined}
              chooseTrack={chooseTrack}
            />
          );
        })}
        {setTimeout(() => {
          scrollToViewRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
            inline: "start",
          });
        }, 500)}
      </div>
    );
  }, [recentSearches, chooseTrack, playingSong, scrollToViewRef]);

  const playlistControl = useCallback(() => {
    if (searchResults.length > 0) {
      return searchResults.map((song) => (
        <PlayListItem
          song={song}
          key={song.track_uri}
          chooseTrack={chooseTrack}
        />
      ));
    } else {
      return <div className="playList-list-lyrics">{lyrics}</div>;
    }
  }, [searchResults, chooseTrack, lyrics]);

  return (
    <div className="playList">
      {recentSearchesControl()}
      <input
        className="playList__search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        placeholder="Şarkı, Albüm veya Sanatçı arayabilirsiniz."
      />
      <div className="playList-list">{playlistControl()}</div>
      <div className="playList-player">
        <Player accessToken={accessToken} trackUri={playingSong?.track_uri} />
      </div>
    </div>
  );
});

export default PlayList;
