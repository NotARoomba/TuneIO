import { ReactNode } from "react";

export interface TitleProps {
  text: string;
  reverse?: boolean;
}
export interface HomeButtonProps {
  page: string;
  double?: boolean;
}
export interface PlayButtonProps {
  title: string;
  link: string;
  img?: string;
  color?: string;
}
export interface PageButtonProps {
  title: string;
  link?: string;
  color?: string;
  action?: () => void;
  disabled?: boolean;
}

export enum STATUS_CODES {
  SUCCESS,
  GENERIC_ERROR,
  USER_NOT_FOUND,
  INVALID_EMAIL,
  INVALID_SERVICE,
  SENT_CODE,
  EMAIL_NOT_EXIST,
  ERROR_SENDING_CODE,
  CODE_DENIED,
  CODE_EXPIRED,
  CODE_FAILED,
  NO_CONNECTION,
  EMAIL_IN_USE,
  USERNAME_IN_USE,
  NONE_IN_USE,
}

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

export interface User {
  _id: string;
  avatar: string;
  username: string;
  email: string;
  album: SpotifyAlbum;
  dateJoined: Date;
  listeningData: ListeningData | null;
  typingData: TypingData | null;
}

export interface LoadingScreenProps {
  loading: boolean;
  text?: string;
  children?: ReactNode;
}

export interface BaseModalProps {
  isOpen: boolean;
  setIsOpen: (o: boolean) => void;
}

export interface AlertModalProps extends BaseModalProps {
  title: string;
  text: string;
  cancel?: boolean;
  action?: () => void;
}

export interface VerificationModalProps extends BaseModalProps {
  email: string;
  action: (v: boolean) => void;
}

export interface ModalButtonProps {
  text: string;
  route?: string;
  action?: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export interface SearchOptionProps {
  title: string;
  img: string;
}

export interface SpotifyImage {
  width: number;
  height: number;
  url: string;
}

export interface SpotifyArtist {
  name: string;
}

export interface SpotifyTrack {
  name: string;
  genre: string;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
}

export interface SpotifyAlbum {
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
}

export interface Buffer {
  data: ArrayBuffer;
}

export interface Song {
  stream: Buffer;
  buffer: AudioBuffer;
  info: SpotifyTrack;
  url: string;
}

export interface AudioPlayerProps {
  song: Song;
}

export interface SongGuessProps {
  guess: SpotifyTrack;
  answer: SpotifyTrack;
}

export interface GuessBoxProps {
  guess: string;
  answer: string;
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
  info: SpotifyTrack | SpotifyAlbum | SpotifyArtist;
  gameType: GAME_TYPES;
  score: number;
  date: number;
}

export interface TypingGame extends Game {
  correct: number;
  incorrect: number;
}

export interface ResultsModalProps extends BaseModalProps {
  game: GAMES;
  statistics: ListeningGame | TypingGame;
  highscore: ListeningGame | TypingGame | undefined;
  resetGame: () => void;
}
