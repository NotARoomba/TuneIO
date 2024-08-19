import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI } from "../../utils/Functions";
import { STATUS_CODES, Song, SpotifyTrack } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import YTDL from "ytdl-core"

export default function Daily() {
    const [song, setSong] = useState<Song>();
    const [url, setURL] = useState("");
    const [alertModal, setAlertModal] = useState(false);
    useEffect(() => {
        callAPI("/music/daily", "GET").then((res: {status: STATUS_CODES, song: Song}) => {
            if (res.status == STATUS_CODES.SUCCESS) {
                console.log(res)
                setSong(res.song);
                const blob = new Blob(res.song.stream, { type: "audio/mp3" });
                setURL(URL.createObjectURL(blob));
                 console.log(URL.createObjectURL(blob))
            } else {
                setAlertModal(true);    
            }
        });
    }, [])
    return <div className="flex flex-col w-screen">
    <Title text="Song" reverse />
    <audio src={url} />
    <AlertModal
        title={"Error"}
        text={"There was an error connecting to the server!"}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </div>
}