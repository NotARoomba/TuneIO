import "react";
import PageButton from "../components/buttons/PageButton";
import Symbols from "../components/misc/Symbols";
import Transitions from "../components/misc/Transitions";

export default function Error() {
  return (
    <Transitions>
      <div className="flex flex-col w-screen h-[100dvh] text-beige">
        <div className="flex flex-col m-auto justify-center gap-2">
          <p className="font-medium text-8xl text-center">404</p>
          <PageButton link="/" title="Home" />
        </div>
        <p className="text-sm absolute bottom-4 font-medium -translate-x-1/2 left-1/2 w-60 text-center">
          Made by Nathan and Henry
        </p>
        <Symbols />
      </div>
    </Transitions>
  );
}
