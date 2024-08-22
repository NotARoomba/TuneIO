import { PauseCircle, PlayCircle } from "react-feather";
import { AudioPlayerProps } from "../../utils/Types";
import { useEffect, useRef, useState } from "react";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";

export default function AudioPlayer({ song }: AudioPlayerProps) {
  const [seek, setSeek] = useState(0);
  const [listens, setListens] = useState(0);
  const [dragging, setDragging] = useState(false);
  const audioPlayer = useAudioPlayer();

  const frameRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setSeek(audioPlayer.getPosition());
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [audioPlayer.getPosition]);

  const seekDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.preventDefault();
    if (!dragging) return;
    setSeek(Math.min(Math.max(seek + 0.045 * event.movementX, 0), 10));
    audioPlayer.seek(Math.min(Math.max(seek + 0.045 * event.movementX, 0), 10));
  };
  const [heights, _setHeights] = useState(
    Array(15)
      .fill(0)
      .map((v) => (v = Math.random() * 60 + 15)),
  );
  useEffect(() => {
    audioPlayer.load(song.url, {
      autoplay: false,
      format: "wav",
    });
  }, []);
  return (
    <div className="flex align-middle gap-8 mx-auto">
      <div
        onClick={() => {
          audioPlayer.togglePlayPause();
          setListens(Math.round(seek) == 0 ? listens + 1 : listens);
        }}
        className="flex my-auto"
      >
        {!(audioPlayer.paused || audioPlayer.stopped) ? (
          <PauseCircle size={40} />
        ) : (
          <PlayCircle size={40} />
        )}
      </div>
      <div className="flex flex-col gap-0">
        <div
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerMove={(e) => seekDrag(e)}
          className="flex select-none align-middle touch-none py-5 gap-2 justify-center"
        >
          {heights.map((v, i) => (
            <span
              onClick={() => setSeek(i + 1)}
              key={i}
              style={{ height: v }}
              className={
                " rounded w-1.5 my-auto transition-colors duration-300 " +
                (i < Math.round(seek * 1.5) ? "bg-beige" : "bg-beige/40")
              }
            />
          ))}
        </div>
        {/* <p className="text-xl mx-auto -mt-2">
          00:
          {Math.floor(seek) < 10
            ? "0" + Math.floor(seek).toString()
            : Math.floor(seek)}
        </p> */}
      </div>
      <p className="text-5xl my-auto transition-all duration-300">{listens}</p>
    </div>
  );
}
