import {AlbumResponse} from "./album-response";

export interface SongResponse {

  id: number;
  title: string;
  albumId: number;
  album: AlbumResponse;
}
