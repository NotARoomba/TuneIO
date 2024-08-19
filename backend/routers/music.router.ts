import express, { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { load } from "ts-dotenv";
import { GENRES, Search } from "../models/music";
import STATUS_CODES from "../models/status";
import { DIFFICULTY } from "../models/games";

export const musicRouter = express.Router();

let dailySong: SpotifyApi.TrackObjectFull;

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
const refreshDaily = async () => {
  const artists = await spotifyApi.search(GENRES[Math.floor(Math.random() * GENRES.length)], ["artist"], {
    limit: 25,
  });
  const trackRes = (await spotifyApi.search(artists.body.artists?.items[Math.floor(Math.random() * artists.body.artists?.items.length)].name ?? "Caseiopea", ["track"], {
    limit: 25,
  }));
  if (trackRes.body.tracks) {
    dailySong = trackRes.body.tracks.items[Math.floor(Math.random() * (trackRes.body.tracks?.items.length))]
    console.log(`Refreshed Daily Song! Song: ${dailySong.name} - ${dailySong.artists[0].name}`)
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
  } catch (error) {
    console.log(error);
    res.status(404).send({ status: STATUS_CODES.GENERIC_ERROR });
  }
})
