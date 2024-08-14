import PlayButton from "../components/buttons/PlayButton";
import Title from "../components/misc/Title";

export default function Play() {
  return (
    <div className="flex flex-col w-screen overflow-hidden">
      <Title text="Play" reverse />
      <div className="flex flex-col pl-8 text-xl font-medium gap-8">
        <div className="flex flex-col gap-2">
          <p>Listening</p>
          <div className="overflow-auto">
            <div className="flex overflow-scroll  w-fit gap-5 pr-4">
              <PlayButton title={"song"} link={"/listen/song"} />
              <PlayButton title={"album"} link={"/listen/album"} />
              <PlayButton title={"artist"} link={"/listen/artist"} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Typing</p>
          <div className="overflow-auto">
            <div className="flex overflow-scroll  w-fit gap-5 pr-4">
              <PlayButton title={"lyrics"} link={"/type/lyrics"} />
              <PlayButton title={"album"} link={"/type/album"} />
              <PlayButton title={"artist"} link={"/type/artist"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
