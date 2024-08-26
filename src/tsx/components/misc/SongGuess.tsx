import Marquee from "react-fast-marquee";
import { SongGuessProps } from "../../utils/Types";
import GuessBox from "./GuessBox";

export default function SongGuess({ guess, answer }: SongGuessProps) {
  return (
    <div className="flex flex-col mx-auto my-2">
      <div className="flex gap-3">
        <GuessBox
          guess={
            guess.genre
              ? guess.genre.charAt(0).toUpperCase() + guess.genre.slice(1)
              : "???"
          }
          answer={answer.genre.charAt(0).toUpperCase() + answer.genre.slice(1)}
        />
        <GuessBox
          guess={guess.artists[0].name}
          answer={answer.artists[0].name}
        />
        <GuessBox guess={guess.album.name} answer={answer.album.name} />
      </div>
      <div className="mx-auto font-medium my-2 px-1 text-rich_black text-2xl justify-center align-middle flex bg-beige min-h-11 w-72 text-center rounded-lg">
        <Marquee delay={1} speed={25} className="text-xl m-auto">
          <p className="mx-2.5">{guess.name}</p>
        </Marquee>
      </div>
    </div>
  );
}
