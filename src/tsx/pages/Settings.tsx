import { useState } from "react";
import PageButton from "../components/buttons/PageButton";
import Title from "../components/misc/Title";

export default function Settings() {
  const [volume, setVolume] = useState(5);
  const [_difficulty, setDifficulty] = useState(5);
  const [dragging, setDragging] = useState(false);

  const difficulties = ["Easy", "Normal", "Hard"];

  const volumeDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (!dragging) return;
    setVolume(volume + 0.03 * event.movementX);
  };
  const changeDifficulty = (event: React.UIEvent<HTMLDivElement>) => {
    setDifficulty(
      Math.round(
        (3 * (event.currentTarget.scrollLeft - 224)) /
          event.currentTarget.scrollWidth,
      ) + 1,
    );
  };
  return (
    <div className="flex flex-col w-screen overflow-hidden h-[100dvh]">
      <Title text="Settings" reverse />
      <div className="flex flex-col mx-auto w-11/12 mt-20 text-xl">
        <p className="font-small text-center">Volume</p>
        <div
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => setDragging(false)}
          onPointerMove={(e) => volumeDrag(e)}
          className="flex select-none touch-none py-5 mx-auto min-w-full gap-1.5 justify-center"
        >
          {Array(10)
            .fill(0)
            .map((_v, i) => (
              <span
                onClick={() => setVolume(i + 1)}
                key={i}
                className={
                  " rounded min-w-5 w-7 min-h-10 " +
                  (i < Math.round(volume) ? "bg-beige" : "bg-beige/40")
                }
              />
            ))}
        </div>
        <p className="font-small text-center">Difficulty</p>
        <div
          onScroll={(e) => changeDifficulty(e)}
          className="flex select-none py-5 gap-5 px-20 snap-x snap-mandatory overflow-scroll no-scrollbar "
        >
          {difficulties.map((v, i) => (
            <div
              key={i}
              onClick={(e) =>
                e.currentTarget.scrollIntoView({ behavior: "smooth" })
              }
              className={
                "mx-auto snap-center  leading-10 transition-all duration-300 flex text-center text-2xl font-medium rounded-lg justify-center min-h-11 py-auto align-middle w-56 min-w-56 " +
                ["bg-ash_gray", "bg-air_force_blue", "bg-midnight_green"][i]
              }
            >
              {v}
            </div>
          ))}
        </div>
      </div>
      <div className="flex mx-auto mt-auto mb-20">
        <PageButton link="/" title="Home" color="bg-ash_gray" />
      </div>
    </div>
  );
}
