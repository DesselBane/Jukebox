import {ArtistResponse} from "./artist-response";

export interface AlbumResponse {

  artistId: number;
  artist : ArtistResponse;
  name: string;
  id: number;
}
