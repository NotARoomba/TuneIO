import PageButton from "../components/buttons/PageButton";
import HomeButton from "../components/buttons/HomeButton";
import Title from "../components/misc/Title";

export default function Settings() {
  return(
    <div className="flex flex-col w-screen overflow-hidden h-[100dvh]">
      <Title text="Settings" reverse />
      <div className="flex flex-col mx-auto gap-5 w-11/12 mt-20 text-xl">
        <div className="flex flex-col mx-auto gap-5 w-11/12 mt-20">
          <p className="font-small text-center">Volume</p>
          <div>
            <div className="relative flex content-end items-center h-14">
              <span className="w-10 h-5 bg-beige"></span>
              <span className="w-10 h-5 bg-beige"></span>
              <span className="w-10 h-5 bg-beige"></span>
              <span className="w-10 h-5 bg-beige"></span>
              <span className="w-10 h-5 bg-beige"></span>
              <input type="range" min="0" max="100" step="10" defaultValue="0"></input>
            </div>
          </div>
        </div>
        <div className="flex flex-col mx-auto gap-5 w-11/12 mt-20">
          <p className="font-small text-center">Difficulty</p>
        </div>
      </div>
        <div className="flex mx-auto mt-auto mb-20">
          <PageButton link="/" title="Home" color="bg-ash_gray"/>
        </div>
    </div>
    
  )
}