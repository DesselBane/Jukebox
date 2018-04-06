import {ArtistResponse} from "./artist-response";

export class AlbumResponse {

  id: number;
  name: string;

  artistId: number;
  artist : ArtistResponse;

}
