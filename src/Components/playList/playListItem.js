import React, { memo, useCallback } from "react";
import "./css/playListItem.scss";

const PlayListItem = memo(({ song, chooseTrack, active,referans}) => {
  const handlePlay = useCallback(() => {
    if (chooseTrack) {
      chooseTrack(song);
    }
  }, [song, chooseTrack]);

  const { track_image_url, track, track_name, artist } = song;

  return (
    <div ref={referans} className={"playListItem " + (active ? "active" : "") } onClick={handlePlay}>
      <div className="playListItem-img">
        <img src={track_image_url} alt={track_name || track} />
      </div>
      <div className="playListItem-text">
        <span>{track_name || track}</span>
        <span>{artist}</span>
      </div>
    </div>
  );
});

export default PlayListItem;
