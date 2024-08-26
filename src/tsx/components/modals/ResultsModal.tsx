import Modal from "react-modal";
import { GAMES, ResultsModalProps } from "../../utils/Types";
import LinkButton from "../buttons/PageButton";
import { getCookie } from "../../utils/Functions";

export default function ResultsModal({
  game,
  statistics,
  highscore,
  isOpen,
  resetGame,
  setIsOpen,
}: ResultsModalProps) {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      className={
        " w-4/12 p-10 rounded-xl h-7/12 min-h-64 min-w-96 bg-rich_black text-beige absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 outline-2 outline outline-air_force_blue-200 " +
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
        <p className="text-4xl font-bold mt-2 text-beige">Game Over</p>
        <p className="text-2xl ">
          {"guesses" in statistics
            ? `${statistics.info.name}`
            : `You guessed ${statistics.correct} ${statistics.correct} correctly!`}
        </p>
        <div className="flex text-center justify-center text-lg my-2">
          <div className="w-1/3 font-bold">
            <p className=" text-xl ">High Score</p>
            <p>{new Date(highscore.time * 1000).toISOString().slice(11, 19)}</p>
            <p>{highscore.score}</p>
            <p>{highscore.info.name}</p>
            <p>
              {"guesses" in highscore ? highscore.guesses : highscore.correct}
            </p>
          </div>
          <div className="w-1/6 font-bold text-secondary-300">
            <p className=" text-xl text-text text-center ">_</p>
            <p>Time</p>
            <p>Score</p>
            <p>Name</p>
            <p>{game.includes("listening") ? "Guesses" : "Correct"}</p>
          </div>
          <div className="w-1/3 font-semibold ">
            <p className=" text-xl font-bold">Your Score</p>
            <p>
              {new Date(statistics.time * 1000).toISOString().slice(11, 19)}
            </p>
            <p>{statistics.score}</p>
            <p>{statistics.info.name}</p>
            <p>
              {"guesses" in statistics ? statistics.guesses : statistics.correct}
            </p>
          </div>
        </div>
        {!getCookie("userID") ? (
          <div className="flex text-xl font-bold justify-center text-center px-10 mx-auto flex-col">
            <p>
              Login or sign up to view your score on the global leaderboard!
            </p>
            <div className="flex justify-center">
              <LinkButton title="Login" link="/login" />
              <LinkButton title="Sign up" link="/signup" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center font-bold text-xl gap-8">
            <LinkButton title="Play Again" action={resetGame} />
            <LinkButton title="Leaderboards" link="/leaderboards" />
          </div>
        )}
        <div className="flex mx-auto mt-3">
          <LinkButton title="Close" action={() => setIsOpen(!isOpen)} />
        </div>
      </div>
    </Modal>
  );
}
