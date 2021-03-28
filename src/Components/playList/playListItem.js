import React from "react";
import './css/playListItem.scss'
const PlayListItem = ({ track, chooseTrack }) => {
  const handlePlay = () => {
    chooseTrack(track);
  };

  return (
    <div className="playListItem" onClick={handlePlay}>
      <div className="playListItem-img">
        <img src={track.albumUrl} alt={track.title} />
      </div>
      <div className="playListItem-text">
        <span>{track.title}</span>
        <span>{track.artist}</span>
      </div>
    </div>
  );
};

export default PlayListItem;
