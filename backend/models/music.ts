type SearchType = "album" | "artist" | "playlist" | "track" | "show" | "episode";
export interface Search {
    type: SearchType,
    query: string
}