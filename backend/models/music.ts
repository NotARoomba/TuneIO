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
  "Pop",
  "Rock",
  "Hip-Hop",
  "Metal",
  "Jazz",
  "Blues",
  "Country",
  "Latin",
  "R&B",
  "Folk",
  "World",
  "Classical",
]

export interface Song {
  stream: ArrayBuffer;
  info: SpotifyApi.TrackObjectFull;
}
