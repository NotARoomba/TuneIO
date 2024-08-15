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
const refreshToken = () => {
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        setTimeout(() => refreshToken(), data.body['expires_in']*1000)
        },
        function(err) {
        console.log(
            'Something went wrong when retrieving an access token',
            err.message
        );
        }
    );
}
refreshToken();

musicRouter.use(express.json());

musicRouter.post("/search", async (req: Request, res: Response) => {
    console.log(req)
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
