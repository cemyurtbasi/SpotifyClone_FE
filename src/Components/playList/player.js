import { useState, useEffect, memo } from "react";
import SpotifyPlayer from "react-spotify-web-playback";

const Player = memo(({ accessToken, trackUri }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => setIsPlaying(true), [trackUri]);
  if (!accessToken) return null;
  return (
    <SpotifyPlayer
      token={accessToken}
      showSaveIcon
      callback={(state) => {
        if (!state.isPlaying) setIsPlaying(false);
      }}
      play={isPlaying}
      uris={trackUri ? [trackUri] : []}
    />
  );
});

export default Player;
