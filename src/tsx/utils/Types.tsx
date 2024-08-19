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

export interface User {
  _id: string;
  avatar: string;
  username: string;
  email: string;
  album: Album;
  dateJoined: Date;
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

export interface AlbumOptionProps {
  title: string;
  img: string;
}

export interface SpotifyImage {
  width: number;
  height: number;
  url: string;
}

export interface SpotifyArtists {
  name: string;
}

export interface SpotifyTrack {
  name: string;
  genre: string;
  artists: SpotifyArtists[];
}

export interface Album {
  name: string;
  artists: SpotifyArtists[];
  images: SpotifyImage[];
}

export interface Buffer {
  data: ArrayBuffer;
  type: string;
}

export interface Song {
  stream: Buffer;
  info: SpotifyTrack;
}
