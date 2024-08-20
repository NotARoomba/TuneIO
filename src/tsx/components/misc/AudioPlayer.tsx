import { PauseCircle, PlayCircle } from "react-feather";
import { AudioPlayerProps } from "../../utils/Types";
import { useEffect, useState } from "react";
// import extractPeaks from "webaudio-peaks"

export default function AudioPlayer({song}: AudioPlayerProps) {
    const [paused, setPaused] = useState(true);
    const [seek, setSeek] = useState(0);
    const [listens, setListens] = useState(0);
    const [dragging, setDragging] = useState(false);

    const seekDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
        event.preventDefault();
        if (!dragging) return;
        setSeek(Math.min(Math.max((seek + 0.045 * event.movementX), 0), 15));
    };
    const [heights, _setHeights] = useState(Array(15).fill(0).map((v) => v = (Math.random() * 75) + 25))
    // useEffect(() => 

    // })
    console.log(song.url)
    return <div className="flex align-middle">
        <div onClick={() => setPaused(!paused)} className="flex m-auto">{paused? <PauseCircle size={40} /> : <PlayCircle size={40} />}</div>
        <div className="flex flex-col mx-auto gap-0">
            <div
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerMove={(e) => seekDrag(e)}
          className="flex select-none align-middle touch-none py-5 gap-1.5 justify-center"
        >
          {heights.map((v, i) => (
              <span
                onClick={() => setSeek(i + 1)}
                key={i}
                style={{height: v}}
                className={
                  " rounded w-2 my-auto " +
                  (i < Math.round(seek) ? "bg-beige" : "bg-beige/40")
                }
              />
            ))}
        </div><p className="text-xl mx-auto -mt-2">{new Date(seek*1000).getSeconds()}</p></div>
        <p className="text-5xl m-auto">{listens}</p>
    </div>
}