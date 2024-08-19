import { useEffect, useState } from "react";
import Title from "../../components/misc/Title";
import { callAPI } from "../../utils/Functions";
import { STATUS_CODES, Song, SpotifyTrack } from "../../utils/Types";
import AlertModal from "../../components/modals/AlertModal";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import YTDL from "ytdl-core"

export default function Daily() {
    const [song, setSong] = useState<Song>();
    const [alertModal, setAlertModal] = useState(false);
    useEffect(() => {
        callAPI("/music/daily", "GET").then((res: {status: STATUS_CODES, song: Song}) => {
            if (res.status == STATUS_CODES.SUCCESS) {
                console.log(res)
                setSong(res.song);
                const stream = YTDL(`https://www.youtube.com/watch?v=${res.song.id}`,  {
                    //filter: "audioonly",
            highWaterMark: 1 << 25,
                })
                 console.log(stream)
            } else {
                setAlertModal(true);    
            }
        });
    }, [])
    const opts: YouTubeProps['opts'] = {
        height: '0',
        width: '0',
        playerVars: {
            start: 15,
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        },
      };
      const onPlayerReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
        // access to player in all event handlers via event.target
        // event.target.pauseVideo();
      }
    return <div className="flex flex-col w-screen">
    <Title text="Song" reverse />
    <YouTube videoId={song?.id} opts={opts}  onReady={onPlayerReady} />
    <AlertModal
        title={"Error"}
        text={"There was an error connecting to the server!"}
        isOpen={alertModal}
        setIsOpen={setAlertModal}
      />
    </div>
}