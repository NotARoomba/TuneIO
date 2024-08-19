import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { load } from "ts-dotenv";
import { Song, GENRES, Search } from "../models/music";
import STATUS_CODES from "../models/status";
import { DIFFICULTY } from "../models/games";
import YTSR, { Video } from "youtube-sr";
import ytdl from "@distube/ytdl-core";

export const musicRouter = express.Router();

let dailySong: Song;

const env = load({
  SPOTIFY_CLIENT: String,
  SPOTIFY_SECRET: String,
});

var spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT,
  clientSecret: env.SPOTIFY_SECRET,
});
const refreshToken = () => {
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log("The access token expires in " + data.body["expires_in"]);
      console.log("The access token is " + data.body["access_token"]);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      refreshDaily();
      setTimeout(() => refreshToken(), data.body["expires_in"] * 1000);
    },
    function (err) {
      console.log(
        "Something went wrong when retrieving an access token",
        err.message,
      );
    },
  );
};
refreshToken();
export function isGoodMusicVideoContent(result: Video, song: SpotifyApi.TrackObjectFull) {
  const contains = (string: any, content: string) => !!~(string || "").indexOf(content);
  return (result.music ? (result.music[0].title.toLowerCase() == song.name.toLowerCase() && result.music[0].artist.toLowerCase() == song.artists[0].name.toLowerCase()) : false || contains(result.channel?.name, "VEVO") || contains(result.channel?.name?.toLowerCase(), "official") || contains(result.title?.toLowerCase(), "official") || !contains(result.title?.toLowerCase(), "extended"));
}
const refreshDaily = async () => {
  const artists = await spotifyApi.search(GENRES[Math.floor(Math.random() * GENRES.length)], ["artist"], {
    limit: 25,
  });
  const trackRes = (await spotifyApi.search(artists.body.artists?.items[Math.floor(Math.random() * artists.body.artists?.items.length)].name ?? "Caseiopea", ["track"], {
    limit: 25,
  }));
  if (trackRes.body.tracks) {
    const info = trackRes.body.tracks.items[Math.floor(Math.random() * (trackRes.body.tracks?.items.length))]
    YTSR.search(`${info.name} - ${info.artists[0].name}`, {type: "video", limit: 25}).then(async search => {
      search.filter((v) => isGoodMusicVideoContent(v, info));
      if (!search[0].id) return refreshDaily();
      const stream = ytdl(search[0].url, {
				filter: "audioonly",
        highWaterMark: 1 << 25,
				requestOptions: {
					headers: {
						Cookie: process.env.YT_COOKIE,
					}
				}
			})
      const chunks: any = [];
      stream.on('data', d => chunks.push(d));
      stream.on('end', () => {
        dailySong = {stream: Buffer.concat(chunks), info}
      })      
  })
    console.log(`Refreshed Daily Song! Song: ${info.name} - ${info.artists[0].name}`)
  } else {
    console.error(`There was an error refreshing the daily song!\n${trackRes}`)
  }
}
setTimeout(() => setInterval(refreshDaily, 1000 * 60 * 60 * 24), (new Date().setHours(24, 0, 0, 0) - new Date().getTime()));

musicRouter.use(express.json());

musicRouter.post("/search", async (req: Request, res: Response) => {
  const data: Search = req.body;
  try {
    const search = await spotifyApi.search(data.query, [data.type], {
      limit: 5,
    });
    if (search.statusCode == 200) {
      res
        .status(200)
        .send({
          search: search.body[`${data.type}s`]?.items,
          status: STATUS_CODES.SUCCESS,
        });
    } else {
      res.status(404).send({
        search: null,
        status: STATUS_CODES.GENERIC_ERROR,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: STATUS_CODES.GENERIC_ERROR });
  }
});

musicRouter.get("/daily", async (req: Request, res: Response) => {
  try {
    res
        .status(200)
        .send({
          song: dailySong,
          status: STATUS_CODES.SUCCESS,
        });
      dailySong.stream.pipe(res);
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: STATUS_CODES.GENERIC_ERROR });
  }
})
