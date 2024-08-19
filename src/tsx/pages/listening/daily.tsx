import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI, isGoodMusicVideoContent } from "../../utils/Functions";
import { STATUS_CODES, SpotifyTrack } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import YTSR from "youtube-sr";

export default function Daily() {
    const [song, setSong] = useState<SpotifyTrack>();
    const [yturl, setYTURL] = useState("");
    const [alertModal, setAlertModal] = useState(false);
    useEffect(() => {
        callAPI("/music/daily", "GET").then((res: {status: STATUS_CODES, song: SpotifyTrack}) => {
            if (res.status == STATUS_CODES.SUCCESS) {
                console.log(res)
                setSong(res.song);
                YTSR.search(res.song.name, {type: "video", limit: 25}).then(search => {
                    search.filter((v) => isGoodMusicVideoContent(v, res.song));
                    console.log(search[0]);
                    setYTURL(search[0].url);
                })
            } else {
                setAlertModal(true);    
            }
        });
    }, [])
    return <div className="flex flex-col w-screen">
    <Title text="Song" reverse />
    <AlertModal
        title={"Error"}
        text={"There was an error connecting to the server!"}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </div>
}