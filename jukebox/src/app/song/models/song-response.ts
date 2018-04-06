import {AlbumResponse} from "./album-response";
import {SongSource} from "./song-source.enum";

export class SongResponse {

  id: number;
  title: string;
  albumId: number;
  album: AlbumResponse;
  sourceType: SongSource;
  source: string;
}
