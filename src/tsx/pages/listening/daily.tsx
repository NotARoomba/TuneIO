import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI } from "../../utils/Functions";
import { STATUS_CODES, Song, SpotifyTrack } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import AudioPlayer from "../../components/misc/AudioPlayer";
import LoadingScreen from "../../components/misc/LoadingScreen";

export default function Daily() {
  const [song, setSong] = useState<Song>();
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
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
  return (
    <div className="flex flex-col w-screen">
      <Title text="Song" reverse />
      {song && <AudioPlayer song={song} />}
      <LoadingScreen loading={loading} />
      <AlertModal
        title={"Error"}
        text={"There was an error connecting to the server!"}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </div>
  );
}
