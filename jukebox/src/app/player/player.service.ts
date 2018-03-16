import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "./models/player-response";
import {PlayerCommandResponse} from "./models/player-command-response";

@Injectable()
export class PlayerService {

  get activePlayerObservable(): Observable<PlayerResponse>
  {
    return this._activePlayerSubject.asObservable();
  }

  get activePlayer(): PlayerResponse {
    return this._activePlayer;
  }

  set activePlayer(value: PlayerResponse) {
    this._activePlayer = value;
    this._activePlayerSubject.next(this._activePlayer);
    localStorage.setItem("currentPlayer",JSON.stringify(this._activePlayer));
  }

  private _activePlayer: PlayerResponse;
  private _activePlayerSubject = new Subject<PlayerResponse>();
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
    let lastPlayer = JSON.parse(localStorage.getItem("currentPlayer"));
    /*if(lastPlayer != null)
      this._activePlayer = new AudioPlayer(lastPlayer._playerId,lastPlayer._name);*/
  }

  getAvailablePlayers() : Observable<PlayerResponse[]>
  {
    return this._http.get<PlayerResponse[]>(`api/player`)
  }

  public addSongToPlaylist(songId: number) : Observable<void>
  {
    console.log(`Adding song: ${songId} to Player: ${this._activePlayer.id}`);

    return this._http.post(`api/player/${this._activePlayer.id}/addSong/${songId}`,"")
      .map(() =>{});
  }

  public executePlayerCommand(cmd: PlayerCommandResponse) : Observable<void>
  {
    console.log(JSON.stringify(cmd));

    return this._http.post(`api/player/${this.activePlayer.id}/executeCommand`,JSON.stringify(cmd), {responseType: 'text'})
      .map(() => {});
  }
}
