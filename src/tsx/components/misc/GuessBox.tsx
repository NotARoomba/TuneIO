import { GuessBoxProps } from "../../utils/Types";

export default function GuessBox({guess, answer}: GuessBoxProps) {
    return <div className={"flex flex-col rounded-xl outline outline-2 outline-beige text-beige text-xl " + (guess==answer?"bg-pastel_green":"bg-pastel_red")}>
        <p className="m-auto">{guess}</p>
    </div>
}