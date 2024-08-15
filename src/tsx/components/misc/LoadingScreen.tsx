import { Triangle } from "react-loader-spinner";
import { LoadingScreenProps } from "../../utils/Types";
import Title from "./Title";

export default function LoadingScreen({
  loading,
  text,
  children,
}: LoadingScreenProps) {
  return (
    <div
      className={
        "absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-rich_black/80" +
        (loading ? " flex animate-show" : " animate-hide")
      }
    >
      <div className="m-auto flex flex-col">
        <Triangle
          visible={loading}
          height="200"
          width="200"
          wrapperStyle={{ margin: "auto" }}
          color="#598392"
          ariaLabel="triangle-loading"
          wrapperClass={loading ? " flex animate-show" : " animate-hide"}
        />
        {loading && (
          <div className="flex -mt-10">
          <Title text="TuneIO" />
            </div>
        )}
        {text && loading && (
          <p className="mx-auto text-center text-2xl font-bold mb-2">
            {text.split("\n")[0]}
            <br />
            {text.split("\n")[1]}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
