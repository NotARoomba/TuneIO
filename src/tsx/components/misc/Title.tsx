import { TitleProps } from "../../utils/Types";

export default function Title({ text, reverse }: TitleProps) {
  return (
    <div className="flex text-6xl mx-auto gap-2 h-fit mt-10 mb-6">
      <img src="/audio.svg" className="h-16" />
      <p className="my-auto font-medium">{text}</p>
      {reverse && <img className=" rotate-180 h-16" src="/audio.svg" />}
    </div>
  );
}
