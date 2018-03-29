import {ArtistResponse} from "./artist-response";

export interface AlbumResponse {
  artist : ArtistResponse;
  name: string;
  id: number;
}
