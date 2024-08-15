import express, { Request, Response } from "express";
import SpotifyWebApi from 'spotify-web-api-node'
import { load } from "ts-dotenv";
import { Search } from "../models/music";
import STATUS_CODES from "../models/status";

export const musicRouter = express.Router();

const env = load({
    SPOTIFY_CLIENT: String,
    SPOTIFY_SECRET: String,
  });


  var spotifyApi = new SpotifyWebApi({
    clientId: env.SPOTIFY_CLIENT,
    clientSecret:env.SPOTIFY_SECRET,
  });

musicRouter.use(express.json());

musicRouter.get("/search", async (req: Request, res: Response) => {
    const data: Search = req.body;
    try {
      const search = await spotifyApi.search(data.query, [data.type], {limit: 5});
      if (search.statusCode == 200) {
        res.status(200).send({ search, status: STATUS_CODES.SUCCESS });
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
