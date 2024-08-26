import { Stream } from "stream";

type SearchType =
  | "album"
  | "artist"
  | "playlist"
  | "track"
  | "show"
  | "episode";
export interface Search {
  type: SearchType;
  query: string;
}

export const GENRES = [
  "pop",
  "rock",
  "hip hop",
  "jazz",
  "country",
  "reggaeton",
  "classical",
];

interface InfoGenre extends SpotifyApi.TrackObjectFull {
  genre: string;
}

export interface Song {
  stream: ArrayBuffer;
  info: InfoGenre;
}
