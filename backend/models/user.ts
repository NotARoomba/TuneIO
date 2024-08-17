import { ListeningData, TypingData } from "./games";

export default class User {
  constructor(
    public _id: string,
    public avatar: string,
    public album: string,
    public username: string,
    public email: string,
    public dateJoined: Date,
    public listeningData: ListeningData | null,
    public typingData: TypingData | null,
  ) {}
}
