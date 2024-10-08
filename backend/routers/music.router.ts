import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { load } from "ts-dotenv";
import { Song, GENRES, Search } from "../models/music";
import STATUS_CODES from "../models/status";
import YTSR, { Video } from "youtube-sr";
import ytdl from "@distube/ytdl-core";
import internal, { Duplex, PassThrough, Stream, Writable } from "node:stream";
import wav from "node-wav";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);

export const musicRouter = express.Router();

let dailySong: Song;

const env = load({
  SPOTIFY_CLIENT: String,
  SPOTIFY_SECRET: String,
  YT_COOKIES: String,
});

const agent = ytdl.createAgent(JSON.parse(env.YT_COOKIES));

var spotifyApi = new SpotifyWebApi({
  clientId: env.SPOTIFY_CLIENT,
  clientSecret: env.SPOTIFY_SECRET,
});
const refreshToken = async () => {
  const data = await spotifyApi.clientCredentialsGrant();
  console.log("The access token expires in " + data.body["expires_in"]);
  console.log("The access token is " + data.body["access_token"]);

  // Save the access token so that it's used in future calls
  spotifyApi.setAccessToken(data.body["access_token"]);
  setTimeout(() => refreshToken(), data.body["expires_in"] * 1000);
};
const init = async () => {
  await refreshToken();
  await refreshDaily();
  setTimeout(
    () => setInterval(refreshDaily, 1000 * 60 * 60 * 24),
    new Date().setHours(24, 0, 0, 0) - new Date().getTime(),
  );
};
async function stream2buffer(stream: Stream): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const _buf = Array<any>();
    stream.on("data", (chunk) => _buf.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(_buf)));
    stream.on("error", (err) => reject(`Error converting stream - ${err}`));
  });
}
export function isGoodMusicVideoContent(
  result: Video,
  song: SpotifyApi.TrackObjectFull,
) {
  const contains = (string: any, content: string) =>
    !!~(string || "").indexOf(content);
  return result.music
    ? result.music[0].title.toLowerCase() == song.name.toLowerCase() &&
        result.music[0].artist.toLowerCase() ==
          song.artists[0].name.toLowerCase()
    : false ||
        contains(result.channel?.name, "VEVO") ||
        contains(result.channel?.name?.toLowerCase(), "official") ||
        contains(result.title?.toLowerCase(), "official") ||
        !contains(result.title?.toLowerCase(), "extended");
}
const refreshDaily = async () => {
  const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
  const artists = await spotifyApi.search(genre, ["artist"], {
    limit: 25,
  });
  const artist =
    artists.body.artists?.items[
      Math.floor(Math.random() * artists.body.artists?.items.length)
    ];
  if (!artist) {
    await refreshDaily();
    return;
  }
  const trackRes = await spotifyApi.search(artist.name, ["track"], {
    limit: 25,
  });
  if (trackRes.body.tracks) {
    trackRes.body.tracks.items.filter(async (v) => {
      (await spotifyApi.getArtist(v["artists"][0].id)).body.genres.includes(
        genre,
      );
    });
    const info =
      trackRes.body.tracks.items[
        Math.floor(Math.random() * trackRes.body.tracks?.items.length)
      ];
    YTSR.search(`${info.name} - ${info.artists[0].name}`, {
      type: "video",
      limit: 25,
    }).then(async (search) => {
      search.filter((v) => isGoodMusicVideoContent(v, info));
      if (!search[0].id) return refreshDaily();
      const stream = ytdl(search[0].url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        // requestOptions: {
        //   headers: {
        //     Cookie: env.YT_COOKIE,
        //   },
        // },
        agent,
      });
      const cutStream = new PassThrough();
      let seek = 0;
      let buffer: Buffer = Buffer.from("");
      // console.log(seek, search[0]);
      do {
        seek = Math.round(
          Math.random() * (search[0].duration / 1000 - 10) + 20,
        );
        ffmpeg(stream)
          .seekOutput(seek)
          .setDuration(10)
          .withNoVideo()
          .toFormat("wav")
          .outputOptions("-movflags frag_keyframe+empty_moov")
          .stream(cutStream)
          .on("error", (err) => console.log("Error during conversion: ", err));
        buffer = await stream2buffer(cutStream);
      } while (buffer.length < 100);
      dailySong = { stream: buffer, info: { ...info, genre } };
      console.log("Buffer Created!");
    });
    console.log(
      `Refreshed Daily Song! Song: ${info.name} - ${info.artists[0].name}`,
    );
  } else {
    console.error(`There was an error refreshing the daily song!\n${trackRes}`);
    await refreshDaily();
  }
};

init();

musicRouter.use(express.json());

musicRouter.post("/search", async (req: Request, res: Response) => {
  const data: Search = req.body;
  try {
    const search = await spotifyApi.search(data.query, [data.type], {
      limit: 5,
    });
    let items = (search.body[`${data.type}s`]?.items as unknown as any) ?? [];
    for (let i = 0; i < items.length; i++) {
      const genre = (
        await spotifyApi.getArtist(items[i]["artists"][0].id)
      ).body.genres.filter((v) => GENRES.includes(v));
      items[i].genre = genre[0];
    }
    if (search.statusCode == 200) {
      res.status(200).send({
        search: items,
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
    res.status(200).send({
      song: dailySong,
      status: STATUS_CODES.SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: STATUS_CODES.GENERIC_ERROR });
  }
});
