import { SongGuessProps } from "../../utils/Types";
import GuessBox from "./GuessBox";

export default function SongGuess({guess, answer}: SongGuessProps) {
    return <div className="flex flex-col mx-auto my-2">
        <div className="flex gap-3">
            <GuessBox guess={guess.genre} answer={answer.genre} />
            <GuessBox guess={guess.artists[0].name} answer={answer.artists[0].name} />
            <GuessBox guess={guess.album.name} answer={answer.album.name} />
        </div>
    </div>
}