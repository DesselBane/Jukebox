import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AudioPlayer} from "./models/audio-player";
import {Subject} from "rxjs/Subject";
import {Song} from "../song/models/song";

@Injectable()
export class PlayerService {

  get activePlayerObservable(): Observable<AudioPlayer>
  {
    return this._activePlayerSubject.asObservable();
  }

  get activePlayer(): AudioPlayer {
    return this._activePlayer;
  }

  set activePlayer(value: AudioPlayer) {
    this._activePlayer = value;
    this._activePlayerSubject.next(this._activePlayer);
    localStorage.setItem("currentPlayer",JSON.stringify(this._activePlayer));
  }

  private _activePlayer: AudioPlayer;
  private _activePlayerSubject = new Subject<AudioPlayer>();

  constructor() {
    let lastPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    this._activePlayer = new AudioPlayer(lastPlayer._playerId,lastPlayer._name);
  }

  getAvailablePlayers() : Observable<AudioPlayer[]>
  {
    return Observable.of([
        new AudioPlayer("DUMMY PLAYER", "DUMMY PLAYER"),
        new AudioPlayer("DUMMY PLAYER2", "DUMMY PLAYER2"),
        new AudioPlayer("DUMMY PLAYER3", "DUMMY PLAYER3"),
        new AudioPlayer("DUMMY PLAYER4", "DUMMY PLAYER4")
      ]);
  }

  addSongToPlaylist(song: Song)
  {
    if(this._activePlayer != null)
    {
      this._activePlayer.currentSong = song;
      this._activePlayer.isPlaying = true;
    }
  }
}
