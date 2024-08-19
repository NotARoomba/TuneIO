import { AlbumOptionProps } from "../../utils/Types";
import Marquee from "react-fast-marquee";

export default function AlbumOption({ title, img }: AlbumOptionProps) {
  return (
    <div className="flex bg-midnight_green h-7 gap-2 w-full animate-show rounded px-2">
      <img src={img} className="h-6 rounded-md my-auto" />
      <Marquee delay={1} speed={25} className="text-xl">
        <p className="mx-4">{title}</p>
      </Marquee>
    </div>
  );
}
