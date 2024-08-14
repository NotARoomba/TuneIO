import { useState, useLayoutEffect } from "react";

export default function Symbols() {
  const letters = [..."♩♪♫♬♭♮♯._"];
  const colors = ["#124559", "#598392", "#aec3b0", "#eff6e0"];
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    function updateSize() {
      setHeight(document.body.scrollHeight);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return (
    <ul
      className={
        "absolute m-0 top-0 left-0 overflow-x-hidden overflow-y-hidden w-full -z-10 bg-rich_black"
      }
      style={{ height: `${height}px` }}
    >
      {[...Array(25)].map((_v, i) => {
        const wh = Math.floor(Math.random() * 131) + 60;
        return (
          <li
            className="absolute flex list-none align-middle justify-center text-8xl w-5 h-5 -bottom-48 animate-animatedLetters"
            key={i}
            style={{
              left: `${Math.floor(Math.random() * 111) - 10}%`,
              color: colors[Math.floor(Math.random() * colors.length)],
              width: wh,
              height: wh,
              animationDelay: `${Math.floor(Math.random() * 15)}s`,
              animationDuration: `${Math.floor(Math.random() * 51) + 10}s`,
            }}
          >
            {letters[Math.floor(Math.random() * letters.length)]}
          </li>
        );
      })}
    </ul>
  );
}
