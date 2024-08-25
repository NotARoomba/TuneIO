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
];

export type InfoGenre<T = SpotifyApi.ArtistObjectFull | SpotifyApi.TrackObjectFull|SpotifyApi.AlbumObjectSimplified|SpotifyApi.PlaylistObjectSimplified|SpotifyApi.ShowObjectSimplified|SpotifyApi.EpisodeObjectSimplified> = T & {
  genre?: string
}

export interface Song {
  stream: ArrayBuffer;
  info: InfoGenre;
}
