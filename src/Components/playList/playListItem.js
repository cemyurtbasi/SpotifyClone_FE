import React, { memo, useCallback } from "react";
import "./css/playListItem.scss";

const PlayListItem = memo(
  ({ song, onDelete, chooseTrack, active, referans }) => {
    const handlePlay = useCallback(() => {
      if (chooseTrack) {
        chooseTrack(song);
      }
    }, [song, chooseTrack]);
    const { track_image_url, track, track_name, artist, track_uri } = song;

    const onDeleteControl = useCallback((e) => {
      if (onDelete) {
        e.stopPropagation();
        onDelete(track_uri);
      }
    },[onDelete,track_uri]);

    return (
      <div
        ref={referans}
        className={"playListItem " + (active ? "active" : "")}
        onClick={handlePlay}
      >
        <div className="playListItem-img">
          <img src={track_image_url} alt={track_name || track} />
          {onDelete && (
            <div onClick={(e) => onDeleteControl(e)} className="playListItem-img-delete">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
              </svg>
            </div>
          )}
        </div>
        <div className="playListItem-text">
          <span>{track_name || track}</span>
          <span>{artist}</span>
        </div>
      </div>
    );
  }
);

export default PlayListItem;
