import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI, checkIfLogin } from "../../utils/Functions";
import { SpotifyAlbum, STATUS_CODES, Song, SpotifyTrack, GAMES, ListeningGame, GAME_TYPES, TypingGame, SpotifyArtist, User, Game } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import AudioPlayer from "../../components/misc/AudioPlayer";
import LoadingScreen from "../../components/misc/LoadingScreen";
import SearchOption from "../../components/misc/SearchOption";
import ModalButton from "../../components/buttons/ModalButton";
import PageButton from "../../components/buttons/PageButton";
import SongGuess from "../../components/misc/SongGuess";
import ResultsModal from "../../components/modals/ResultsModal";
import { useNavigate } from "react-router-dom";

export default function Daily() {
  const navigate = useNavigate();
  const [song, setSong] = useState<Song>();
  const [user, setUser] = useState<User | false>(false);
  const [guess, setGuess] = useState<SpotifyTrack | null>();
  const [guesses, setGuesses] = useState<SpotifyTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [alertOpt, setAlertOpt] = useState({title: "Error", msg: "An error occured!", action: () => {}});
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverModal, setGameOverModal] = useState(false);
  const [gameData, setGameData] = useState<ListeningGame>();
  const [highscore, setHighscore] = useState<ListeningGame>();
  const [time, setTime] = useState(0);
  const setAlert = (msg: string, title: string = "Error", action: () => void = () => {}) => {
    setAlertOpt({title, msg, action});
    setAlertModal(true);
  };
  const resetGame = async () => {
    setLoading(true);
    const user = await checkIfLogin();
    setUser(user);
    
    if (user) {
      const lastGame = user.listeningData?.dailyGames.sort((a: Game, b: Game) => b.date - a.date)[0]
      console.log(new Date(lastGame?.date ?? 0).toLocaleDateString())
      if (new Date(lastGame?.date ?? 0).toLocaleDateString() == new Date(Date.now()).toLocaleDateString()) {
        setGameData(lastGame);
        setGameOver(true);
      }
    }
    const res: { status: STATUS_CODES; song: Song } = await callAPI("/music/daily", "GET")
        if (res.status == STATUS_CODES.SUCCESS) {
          const bufferData = new Uint8Array(res.song.stream.data);
          const blob = new Blob([bufferData], { type: "audio/wav" });
          setSong({ ...res.song, url: URL.createObjectURL(blob) });
          setGuesses([]);
          setGuess(null);
          setTime(0);
          setSearchQuery("")
          setLoading(false);
        } else {
          setAlert("There was an error fetching the daily song!", "Error", () => navigate("/play"));
          setLoading(false);
        }
  };
  useEffect(() => {
    resetGame();
  }, []);
  const submitGuess = () => {
    if (!guess) return;
    setGuesses([...guesses, guess]);
    setSearchQuery("");
    if (guess.name == song?.info.name) setGameOver(true);
    setGuess(null);
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      if (searchQuery.length == 0 || guess?.name == searchQuery) {
        setLoading(false);
        setSearch([]);
        return;
      }
      setGuess(null);
      const res = await callAPI("/music/search", "POST", {
        query: searchQuery,
        type: "track",
      });
      if (res.status !== STATUS_CODES.SUCCESS) {
        setLoading(false);
        return setAlert("There was an error fetching the tracks!");
      }
      setSearch(res.search);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
  useEffect(() => {
    const interval = setInterval(() => setTime(time + 1), 1000);
    return () => clearInterval(interval);
  }, [time]);
  useEffect(() => {
    //upload game to user profile
    //show modal
    if (!gameOver) return;
    setLoading(true);
    const updateUserGame = async () => {
      const game: ListeningGame = {gameType: GAME_TYPES.SONG, time, guesses: guesses.length, score: Math.round((((60/time)*(10/(guesses.length)))*10000)), info: song?.info ?? {} as SpotifyTrack, date: Date.now()};
      if (user) {
        if (!gameData) { 
          setGameData(gameData ?? game);
          const updateRes = await callAPI("/games/update", "POST", {
          userID: user._id,
          type: GAMES.LISTENING_DAILY,
          game
        });
        if (updateRes.status !== STATUS_CODES.SUCCESS) {
          setAlert("There was an error uploading the score!");
        }
      }
        const highscoreRes = await callAPI(`/users/${user._id}/highscore?gameType=${GAMES.LISTENING_DAILY}`, "GET");
        console.log(highscoreRes)
        if (highscoreRes.status !== STATUS_CODES.SUCCESS) {
          setAlert("There was an error getting your highscore!");
        }
        setHighscore(highscoreRes.highscore)
      }
      setGameOverModal(true);
      setLoading(false);
    }
    updateUserGame();
  }, [gameOver])
  return (
    <div className="flex flex-col w-screen">
      <Title text="Song" reverse />
      {song && <AudioPlayer song={song} />}
      <input
        value={searchQuery}
        onChange={(e) =>
          setSearchQuery(e.currentTarget.value)
        }
        placeholder="input"
        className="mx-auto my-2 text-rich_black text-2xl bg-beige min-h-11 w-72 text-center rounded-lg"
      />
      {!guess && (
          <div
            className={
              "flex w-72 gap-2 my-2 flex-col max-h-24 overflow-scroll min-w-72 mx-auto " +
              (!guess ? "animate-show" : "animate-hide")
            }
          >
            {search
              .filter((v: SpotifyTrack) => v.album.images.length !== 0)
              .map((v: SpotifyTrack, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setGuess(v);
                    setSearchQuery(v.name);
                  }}
                  className=" cursor-pointer"
                >
                  <SearchOption title={v.name} img={v.album.images[0].url} />
                </div>
              ))}
          </div>
        )}
        {guess && (
          <button
          onClick={submitGuess}
          className={
            "mx-auto leading-10 transition-all text-beige hover:brightness-125 duration-300 flex text-center text-lg font-medium rounded-lg justify-center min-h-11 py-auto align-middle w-72 bg-midnight_green  " 
          }
        >
          Submit
        </button>
        )}
      {guesses.length !== 0 && <div className="flex flex-col w-11/12 mx-auto justify-center animate-show">
        <div className="flex justify-evenly text-2xl font-medium">
          <p>Genre</p>
          <p>Artist</p>
          <p>Album</p>
        </div>
        <div className=" overflow-y-scroll max-h-64 flex flex-col">
        {song && guesses.map((v, i) => <SongGuess key={i} guess={v} answer={song.info} />)}
          </div>
      </div>}
      <LoadingScreen loading={loading} />
      <AlertModal
        title={alertOpt.title}
        text={alertOpt.msg}
        action={alertOpt.action}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
      {highscore && gameData && <ResultsModal isOpen={gameOverModal} setIsOpen={setGameOverModal} highscore={highscore} statistics={gameData} game={GAMES.LISTENING_DAILY} resetGame={resetGame} />}
    </div>
  );
}
