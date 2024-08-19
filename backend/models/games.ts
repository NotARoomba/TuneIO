export interface ListeningData {
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
  gameType: GAME_TYPES;
  score: number;
}

export interface TypingGame extends Game {
  time: number;
  correct: number;
  incorrect: number;
}

export enum GAMES {
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
  HARD
}