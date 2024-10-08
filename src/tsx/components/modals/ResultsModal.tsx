import Modal from "react-modal";
import { ResultsModalProps } from "../../utils/Types";
import LinkButton from "../buttons/PageButton";
import { getCookie } from "../../utils/Functions";
import ModalButton from "../buttons/ModalButton";
import Marquee from "react-fast-marquee";
import { useCountdown } from "../misc/useCountdown";

export default function ResultsModal({
  game,
  statistics,
  highscore,
  isOpen,
  resetGame,
  setIsOpen,
}: ResultsModalProps) {
  const [days, hours, minutes, seconds] = useCountdown();
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-11/12 p-4 rounded-xl h-7/12 min-h-64 bg-rich_black text-beige absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-2 outline outline-air_force_blue-200 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      overlayClassName={
        "bg-rich_black/80 absolute w-full h-full top-0 left-0 " +
        (isOpen ? "animate-show" : "animate-hide")
      }
      closeTimeoutMS={300}
    >
      <div className="w-full h-full flex flex-col text-center">
        {/* <div className="flex mx-auto">
          {[..."Game Over"].map((v, i) => (
            <p
              key={i}
              className={
                "text-6xl font-bold mt-2 " +
                colors[Math.floor(Math.random() * colors.length)]
              }
            >
              {v}
            </p>
          ))}
        </div> */}
        <p className="text-4xl font-bold mt-2 text-air_force_blue">Game Over</p>
        <p className="text-lg font-medium ">
          {"guesses" in statistics
            ? `You found "${statistics.info.name}" in ${statistics.guesses} guess${statistics.guesses == 1 ? "" : "es"}!`
            : `You guessed ${statistics.correct} ${statistics.correct} correctly!`}
        </p>
        <p className="font-bold text-ash_gray">
          New Song in {hours < 10 ? "0" + hours : hours}:
          {minutes < 10 ? "0" + minutes : minutes}:
          {seconds < 10 ? "0" + seconds : seconds}
        </p>
        <div className="flex text-center justify-around text-lg my-2  text-nowrap">
          <div className="w-1/3 font-medium">
            <p className=" text-md font-bold text-air_force_blue ">
              High Score
            </p>
            <p>
              {highscore
                ? new Date(highscore.time * 1000).toISOString().slice(11, 19)
                : "???"}
            </p>
            <p>{highscore?.score ?? "???"}</p>
            <Marquee delay={1} speed={25} className="text-xl m-auto">
              {" "}
              <p className="mx-2.5">{highscore?.info.name ?? "???"}</p>
            </Marquee>
            <p>
              {highscore
                ? "guesses" in highscore
                  ? highscore.guesses
                  : highscore.correct
                : "???"}
            </p>
          </div>
          <div className="w-1/3 flex flex-col justify-center font-bold text-secondary-300">
            <p className=" text-xl text-text text-center text-air_force_blue font-medium ">
              _
            </p>
            <p className="text-center">Time</p>
            <p className="text-center">Score</p>
            <p className="text-center">Name</p>
            <p className="text-center">
              {game.includes("listening") ? "Guesses" : "Correct"}
            </p>
          </div>
          <div className="w-1/3 font-medium ">
            <p className=" text-lg font-bold text-air_force_blue">Your Score</p>
            <p>
              {new Date(statistics.time * 1000).toISOString().slice(11, 19)}
            </p>
            <p>{statistics.score}</p>
            <Marquee delay={1} speed={25} className="text-xl m-auto">
              <p className="mx-2.5">
                {statistics.info.name} -{" "}
                {"artists" in statistics.info
                  ? statistics.info.artists[0].name
                  : statistics.info.name}
              </p>
            </Marquee>
            <p>
              {"guesses" in statistics
                ? statistics.guesses
                : statistics.correct}
            </p>
          </div>
        </div>
        {!getCookie("userID") ? (
          <div className="flex gap-2 font-bold justify-center text-center mx-auto flex-col">
            <p>
              Login or sign up to view your score on the global leaderboard!
            </p>
            <div className="flex justify-center  font-bold text-xl gap-4">
              <ModalButton text="Login" route="/login" />
              <ModalButton text="Sign up" route="/signup" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center font-bold text-xl gap-8">
            <ModalButton text="Play Again" action={resetGame} />
            <ModalButton text="Leaderboards" route="/leaderboards" />
          </div>
        )}
        <div className="flex mx-auto mt-3">
          <LinkButton
            title="Close"
            color="bg-midnight_green"
            action={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>
    </Modal>
  );
}
