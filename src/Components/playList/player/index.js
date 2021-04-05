import React, { useEffect, memo, useCallback } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = memo(({ accessToken, trackUri, isPlaying, setIsPlaying, songFinishedControl }) => {
  useEffect(
    () => setIsPlaying(true),
    // eslint-disable-next-line
    [trackUri]
  );

  const playingControl = useCallback((state) => {
    if(state?.position === 0 && state?.status === "READY" && state.previousTracks.length > 0){
      songFinishedControl()
    }
    setIsPlaying(false);
  },[setIsPlaying,songFinishedControl]);

  if (!accessToken) return "";

  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) playingControl(state);
      }}
      play={trackUri ? isPlaying : false}
      uris={trackUri ? [trackUri] : []}
    />
  );
});

export default Player;
