import { Outlet } from "react-router-dom";
// import Letters from "../effects/Letters";
import Navbar from "./Navbar";
// import Credits from "../misc/Credits";

export default function NavbarWrapper() {
  return (
    <>
      <Navbar />
      <Outlet />
      {/* <Letters /> */}
      {/* <Credits /> */}
    </>
  );
}
