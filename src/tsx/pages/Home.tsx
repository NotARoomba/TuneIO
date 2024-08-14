import HomeButton from "../components/buttons/HomeButton";
import Title from "../components/misc/Title";

export default function Home() {
  return (
    <div className="flex flex-col w-screen">
      <Title text="TuneIO" />
      <div className="flex flex-col mx-auto gap-5 w-11/12 mt-20">
        <HomeButton page="play" double />
        <div className="flex gap-5 justify-between">
          <HomeButton page="settings" />
          <HomeButton page="profile" />
        </div>
      </div>
    </div>
  );
}
