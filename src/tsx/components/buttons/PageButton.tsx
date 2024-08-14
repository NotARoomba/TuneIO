import { Link } from "react-router-dom";
import { PageButtonProps } from "../../utils/Types";

export default function PageButton({ title, link, color }: PageButtonProps) {
  const colors = [
    "bg-midnight_green",
    "bg-air_force_blue",
    "bg-ash_gray",
    "bg-lime_green",
    "bg-beige",
  ];
  const bg = color ?? colors[Math.floor(Math.random() * colors.length)];
  const isDark = colors.indexOf(bg) < 3;
  return (
    <Link
      to={link}
      className={
        "mx-auto leading-10 transition-all duration-300 flex text-center text-2xl font-medium rounded-lg justify-center min-h-11 py-auto align-middle min-w-72 " +
        (isDark
          ? "text-beige hover:brightness-125 "
          : "text-rich_black hover:brightness-75 ") +
        bg
      }
    >
      {title}
    </Link>
  );
}
