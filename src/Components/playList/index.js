import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../../Shared/utils/useAuth";
import "./css/playList.scss";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import PlayListItem from "./playListItem";
import Player from "./player";
import { getBaseServiceUrl } from "../../Shared/utils/baseUrls";

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.REACT_APP_CLIENT_ID,
});

const code = new URLSearchParams(window.location.search).get("code");

const PlayList = () => {
  const accessToken = useAuth(code);
  const [recentSearches, setRecentSearches] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");

  const chooseTrack = useCallback((track) => {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }, []);

  useEffect(() => {
    axios.post(getBaseServiceUrl() + "/GetAllSong").then((res) => {
      if (res.data.status === "Success") {
        setRecentSearches(res.data.data);
      }
    });
  }, [playingTrack]);

  useEffect(() => {
    if (!playingTrack) return;
    if (playingTrack.lyrics) return setLyrics(playingTrack.lyrics);

    axios
      .post(getBaseServiceUrl() + "/GetLyric", {
        artist: playingTrack.artist,
        track: playingTrack.title,
        track_uri: playingTrack.uri,
        track_image_url: playingTrack.albumUrl,
      })
      .then((res) => {
        setLyrics(res.data.lyrics);
        axios.post(getBaseServiceUrl() + "/GetAllSong").then((res) => {
          if (res.data.status === "Success") {
            setRecentSearches(res.data.data);
          }
        });
      });
  }, [playingTrack]);

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
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
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true);
  }, [search, accessToken]);

  const recentSearchesControl = useCallback(() => {
    if (!recentSearches) return "";

    return (
      <div className="playList-recentSearches">
        {recentSearches.map((song, i) => {
          return (
            <div
              className="playList-recentSearches-item"
              key={i}
              onClick={() =>
                chooseTrack({
                  uri: song.track_uri,
                  lyrics: song.lyrics,
                })
              }
            >
              <div className="playList-recentSearches-item-img">
                <img src={song.track_image_url} alt={song.track} />
              </div>
              <div className="playList-recentSearches-item-text">
                <span>{song.track}</span>
                <span>{song.artist}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [recentSearches, chooseTrack]);

  return (
    <div className="playList">
      {recentSearchesControl()}
      <input
        className="playList__search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        type="text"
        placeholder="Şarkı, Albüm veya Sanatçı arayabilirsiniz."
      />
      <div className="playList-list">
        {searchResults.map((track) => (
          <PlayListItem
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="playList-lyrics" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>
      <div className="playList-player">
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </div>
  );
};

export default PlayList;
