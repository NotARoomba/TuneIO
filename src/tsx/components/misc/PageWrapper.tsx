import { Outlet } from "react-router-dom";
import Symbols from "./Symbols";
import Credits from "./Credits";
import Transitions from "./Transitions";

export default function PageWrapper() {
  return (
    <div className="h-[100dvh] w-screen overflow-y-hidden flex text-beige">
      <Transitions>
        <Outlet />
      </Transitions>
      <Symbols />
      <Credits />
    </div>
  );
}
