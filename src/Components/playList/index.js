import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../../Shared/utils/useAuth";
import "./css/playList.scss";
import SpotifyWebApi from "spotify-web-api-node";
import PlayListItem from "./playListItem";
import Player from "./player";
import PublicService from "../../Store/public";
import RecentSearches from "./recentSearches";

const spotifyApi = new SpotifyWebApi({
  clientId: "c3cffede07d5469081fa41af153063fe",
});
const publicService = new PublicService();

const PlayList = memo(() => {
  const accessToken = useAuth();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingSong, setPlayingSong] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  const chooseTrack = useCallback((song) => {
    setPlayingSong(song);
    setSearchText("");
  }, []);

  const recentSearchesRef = useRef();
  useEffect(() => {
    if (!playingSong) return;
    if (playingSong.lyrics) {
      return setLyrics(playingSong.lyrics);
    }
    setLoading(true);
    publicService.getSongLyric({ ...playingSong }).then((res) => {
      setLoading(false);
      setLyrics(res.lyrics);
      recentSearchesRef?.current?.getAllSongs();
    });
  }, [playingSong, loading]);

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

  const searchResultsControl = useCallback(() => {
    if (searchResults.length > 0) {
      return searchResults.map((song) => (
        <PlayListItem
          song={song}
          key={song.track_uri}
          chooseTrack={chooseTrack}
        />
      ));
    } else {
      if (loading)
        return (
          <div className="playList-list-lyrics">
            <img
              src="../Assets/images/loading.gif"
              alt="Spotif Loading"
              className="playList-list-lyrics__loadingImage"
              style={{
                maxWidth: 200,
                maxHeight: 200,
                margin: "auto",
                display: "block",
              }}
            />
          </div>
        );
      return <div className="playList-list-lyrics">{lyrics}</div>;
    }
  }, [searchResults, chooseTrack, lyrics, loading]);

  const songFinishedControl = useCallback(() => {
    recentSearchesRef?.current?.choseNextTrack();
  }, []);

  return (
    <div className="playList">
      <RecentSearches
        ref={recentSearchesRef}
        playingSong={playingSong}
        chooseTrack={chooseTrack}
      />
      <input
        className="playList__search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        placeholder="Şarkı, Albüm veya Sanatçı arayabilirsiniz."
      />
      <div className="playList-list">{searchResultsControl()}</div>
      <div className="playList-player">
        <Player
          accessToken={accessToken}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          trackUri={playingSong?.track_uri}
          songFinishedControl={songFinishedControl}
        />
      </div>
    </div>
  );
});

export default PlayList;
