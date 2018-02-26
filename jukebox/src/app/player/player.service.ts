import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AudioPlayer} from "./models/audio-player";

@Injectable()
export class PlayerService {
  get activePlayer(): AudioPlayer {
    return this._activePlayer;
  }

  set activePlayer(value: AudioPlayer) {
    this._activePlayer = value;
  }

  private _activePlayer: AudioPlayer;

  constructor() { }

  getAvailablePlayers() : Observable<AudioPlayer[]>
  {
    return Observable.of([
        new AudioPlayer("DUMMY PLAYER", "DUMMY PLAYER"),
        new AudioPlayer("DUMMY PLAYER2", "DUMMY PLAYER2"),
        new AudioPlayer("DUMMY PLAYER3", "DUMMY PLAYER3"),
        new AudioPlayer("DUMMY PLAYER4", "DUMMY PLAYER4")
      ]);
  }

}
