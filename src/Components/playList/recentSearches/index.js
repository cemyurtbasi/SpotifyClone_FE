import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import PublicService from "../../../Store/public";
import PlayListItem from "../playListItem";
import "../css/recentSearches.scss";

const publicService = new PublicService();

const RecentSearches = memo(
  forwardRef(({ playingSong, chooseTrack }, ref) => {
    const [recentSearches, setRecentSearches] = useState(null);
    const scrollToViewRef = useRef(null);

    useImperativeHandle(ref, () => ({
      choseNextTrack() {
        choseNextTrackControl();
      },
    }));

    const choseNextTrackControl = useCallback(() => {
      if (recentSearches?.length > 1 && recentSearches && playingSong) {
        const findexIndex = recentSearches.findIndex(
          (e) => e.track_uri === playingSong.track_uri
        );
        if (recentSearches[findexIndex + 1]) {
          setTimeout(() => {
            chooseTrack(recentSearches[findexIndex + 1]);
          }, 200);
        }else{
          setTimeout(() => {
            chooseTrack(recentSearches[0]);
          }, 200);
        }
      }
    }, [playingSong, recentSearches, chooseTrack]);

    useEffect(() => {
      publicService.getAllSongs().then((res) => {
        if (res.status === "Success") {
          setRecentSearches(res.data);
        }
      });
    }, []);

    const componentControl = useMemo(() => {
      if (!recentSearches) return "";

      return (
        <div className="recentSearches">
          {recentSearches.map((song, i) => {
            const isActive = playingSong?.track_uri === song.track_uri;
            setTimeout(() => {
              scrollToViewRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
                inline: "start",
              });
            }, 500);
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
        </div>
      );
    }, [chooseTrack, playingSong?.track_uri, recentSearches]);

    return componentControl;
  })
);

export default RecentSearches;
