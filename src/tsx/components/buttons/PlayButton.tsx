import { Link } from "react-router-dom";
import { PlayButtonProps } from "../../utils/Types";

export default function PlayButton({
  title,
  link,
  img,
  color,
}: PlayButtonProps) {
  const colors = [
    "bg-midnight_green",
    "bg-air_force_blue",
    "bg-ash_gray",
    "bg-lime_green",
    "bg-beige",
  ];
  const bg = color ?? colors[Math.floor(Math.random() * colors.length)];
  const isDark = colors.indexOf(bg) < 2;
  return (
    <Link
      to={link}
      className={
        "w-40 transition-all duration-300 p-2 aspect-square flex flex-col rounded-xl jusitfy-center font-medium text-2xl hover:shadow-inner-figma " +
        (isDark
          ? "text-beige hover:brightness-125 "
          : "text-rich_black hover:brightness-75 ") +
        bg
      }
    >
      <img
        className={"h-20 my-auto " + (!isDark ? "dark_doodle " : "")}
        src={img ?? `/doodles/${title}_doodle.svg`}
      />
      <p className="mx-auto">{title.toLocaleUpperCase()}</p>
    </Link>
  );
}
