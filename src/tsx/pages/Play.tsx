import PageButton from "../components/buttons/PageButton";
import PlayButton from "../components/buttons/PlayButton";
import Title from "../components/misc/Title";

export default function Play() {
  return (
    <div className="flex flex-col w-screen overflow-hidden">
      <Title text="Play" reverse />
      <div className="flex flex-col pl-8 text-xl font-medium gap-6">
        <div className="flex flex-col gap-2">
          <p>Listening</p>
          <div className="overflow-auto">
            <div className="flex overflow-scroll overflow-y-hidden  w-fit gap-5 pr-4">
              <PlayButton
                title={"daily song"}
                link={"/listen/daily"}
                img="/doodles/song_doodle.svg"
                color="bg-air_force_blue"
              />
              <PlayButton
                title={"album"}
                link={"/listen/album"}
                color="bg-ash_gray"
              />
              <PlayButton
                title={"artist"}
                link={"/listen/artist"}
                color="bg-beige"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <p>Typing</p>
          <div className="overflow-auto">
            <div className="flex overflow-x-scroll overflow-y-hidden  w-fit gap-5 pr-4">
              <PlayButton
                title={"lyrics"}
                link={"/type/lyrics"}
                color="bg-midnight_green"
              />
              <PlayButton
                title={"album"}
                link={"/type/album"}
                color="bg-beige"
              />
              <PlayButton
                title={"artist"}
                link={"/type/artist"}
                color="bg-ash_gray"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 pr-8">
          <PageButton
            title="Leaderboards"
            link="/leaderboards"
            color="bg-air_force_blue"
          />
          <PageButton title="Home" link="/" color="bg-ash_gray" />
        </div>
      </div>
    </div>
  );
}
