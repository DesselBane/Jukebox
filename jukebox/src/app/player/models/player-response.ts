import {SongResponse} from "../../song/models/song-response";

export interface PlayerResponse{
  id: string,
  name: string
  isPlaying: boolean,
  playlist: SongResponse[],
  playlistIndex: number
}
