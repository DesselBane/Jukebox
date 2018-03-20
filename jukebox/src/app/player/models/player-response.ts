import {SongResponse} from "../../song/models/song-response";
import {WebPlayerState} from "./web-player-state.enum";

export interface PlayerResponse{
  id: number,
  name: string
  state: WebPlayerState,
  playlist: SongResponse[],
  playlistIndex: number
}
