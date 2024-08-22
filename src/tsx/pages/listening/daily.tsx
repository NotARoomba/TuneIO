import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI } from "../../utils/Functions";
import { SpotifyAlbum, STATUS_CODES, Song, SpotifyTrack } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import AudioPlayer from "../../components/misc/AudioPlayer";
import LoadingScreen from "../../components/misc/LoadingScreen";
import SearchOption from "../../components/misc/SearchOption";
import ModalButton from "../../components/buttons/ModalButton";
import PageButton from "../../components/buttons/PageButton";
import SongGuess from "../../components/misc/SongGuess";

export default function Daily() {
  const [song, setSong] = useState<Song | null>(null);
  const [guess, setGuess] = useState<SpotifyTrack | null>();
  const [guesses, setGuesses] = useState<SpotifyTrack[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [search, setSearch] = useState([]);
  const [alertMsg, setAlertMsg] = useState(["Error", "An error occured!"]);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const setAlert = (msg: string, title?: string) => {
    title ? setAlertMsg([title, msg]) : setAlertMsg(["Error", msg]);
    setAlertModal(true);
  };
  useEffect(() => {
    setLoading(true);
    callAPI("/music/daily", "GET").then(
      (res: { status: STATUS_CODES; song: Song }) => {
        if (res.status == STATUS_CODES.SUCCESS) {
          const bufferData = new Uint8Array(res.song.stream.data);
          const blob = new Blob([bufferData], { type: "audio/wav" });
          setSong({ ...res.song, url: URL.createObjectURL(blob) });
          setLoading(false);
        } else {
          setAlertModal(true);
          setLoading(false);
        }
      },
    );
  }, []);
  const submitGuess = () => {
    if (!guess) return;
    setGuesses([...guesses, guess]);
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
      console.log(res);
      if (res.status !== STATUS_CODES.SUCCESS) {
        setLoading(false);
        return setAlert("There was an error fetching the tracks!");
      }
      setSearch(res.search);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);
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
        {song && guesses.map((v, i) => <SongGuess key={i} guess={v} answer={song.info} />)}
      </div>}
      <LoadingScreen loading={loading} />
      <AlertModal
        title={alertMsg[0]}
        text={alertMsg[1]}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </div>
  );
}
