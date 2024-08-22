import Marquee from "react-fast-marquee";
import { GuessBoxProps } from "../../utils/Types";

export default function GuessBox({guess, answer}: GuessBoxProps) {
    return <div className={"flex flex-col rounded-xl text-center px-1 w-24 aspect-square outline outline-2 outline-beige text-beige text-xl " + (guess==answer?"bg-pastel_green":"bg-pastel_red")}>
        <Marquee delay={1} speed={25} className="text-xl m-auto">
        <p>{guess}</p>
      </Marquee>
    </div>
}