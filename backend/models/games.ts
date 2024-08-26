export interface ListeningData {
  dailyGames: Array<ListeningGame>;
  songGames: Array<ListeningGame>;
  albumGames: Array<ListeningGame>;
  artistGames: Array<ListeningGame>;
}

export interface TypingData {
  lyricsGames: Array<TypingGame>;
  albumGames: Array<TypingGame>;
  artistGames: Array<TypingGame>;
}

export enum GAME_TYPES {
  SONG,
  ALBUM,
  ARTIST,
  LYRICS,
}

export interface ListeningGame extends Game {
  guesses: number;
}

export interface Game {
  time: number;
  info: SpotifyApi.TrackObjectFull | SpotifyApi.AlbumObjectFull | SpotifyApi.ArtistObjectFull;
  gameType: GAME_TYPES;
  score: number;
  date: number;
}

export interface TypingGame extends Game {
  correct: number;
  incorrect: number;
}

export enum GAMES {
  LISTENING_DAILY = "listeningData.dailyGames",
  LISTENING_SONG = "listeningData.songGames",
  LISTENING_ALBUM = "listeningData.albumGames",
  LISTENING_ARTIST = "listeningData.artistGames",
  TYPING_LYRICS = "typingData.lyricsGames",
  TYPING_ALBUM = "typingData.albumGames",
  TYPING_ARTIST = "typingData.artistGames",
}

export interface HighScore {
  _id: string;
  username: string;
  avatar: string;
  score: number;
  time?: number;
  correct?: string;
}

export enum DIFFICULTY {
  EASY,
  MEDIUM,
  HARD,
}
