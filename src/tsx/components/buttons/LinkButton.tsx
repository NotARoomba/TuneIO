import { Link } from "react-router-dom";
import { LinkButtonProps } from "../../utils/Types";

export default function LinkButton({
  route,
  action,
  text,
  disabled,
  selected,
}: LinkButtonProps) {
  return route ? (
    <Link
      to={route}
      className={
        "px-4 w-36 lg:w-40 xl:w-44 min-w-fit rounded-lg text-rich_black hover:bg-ash_gray hover:shadow-md text-center transition-all duration-300 text-lg md:text-xl py-2 mx-auto font-bold  " +
        (selected ? "bg-ash_gray" : "bg-beige")
      }
    >
      {text}
    </Link>
  ) : (
    <button
      disabled={disabled}
      onClick={action}
      className={
        "px-4 w-36 lg:w-40 xl:w-44 min-w-fit rounded-lg text-rich_black hover:bg-ash_gray hover:shadow-md text-center transition-all duration-300 text-lg md:text-xl py-2 mx-auto font-bold " +
        (selected ? "bg-ash_gray" : "bg-beige")
      }
    >
      {text}
    </button>
  );
}
