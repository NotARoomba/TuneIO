import { Link } from "react-router-dom";
import { HomeButtonProps } from "../../utils/Types";

export default function HomeButton({ page, double }: HomeButtonProps) {
  return (
    <Link
      className={
        "bg-beige group hover:-translate-y-1 transition-all duration-300 group text-rich_black flex rounded-lg h-40 " +
        (double ? "  w-full" : "w-44")
      }
      to={page}
    >
      <img
        className="m-auto h-24 z-20 duration-300 group-hover:drop-shadow-doodle"
        src={`/${page}_doodle.svg`}
      />
    </Link>
  );
}
