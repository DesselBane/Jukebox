import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "./models/player-response";
import {PlayerCommandResponse} from "./models/player-command-response";
import {Observer} from "rxjs/Observer";

@Injectable()
export class PlayerService {
  get activePlayerChanged(): EventEmitter<PlayerResponse> {
    return this._activePlayerChanged;
  }

  get activePlayer(): PlayerResponse {
    return this._activePlayer;
  }

  set activePlayer(value: PlayerResponse) {
    this._activePlayer = value;
    this._activePlayerChanged.emit(this._activePlayer);
    localStorage.setItem("currentPlayerId",String(this._activePlayer.id));

    if(this._notificationSocket == null)
      this.openNotificationSocket();
  }


  private _activePlayer: PlayerResponse;
  private _activePlayerChanged = new EventEmitter<PlayerResponse>();
  private _http: HttpClient;
  private _notificationSocket: WebSocket;

  constructor(http: HttpClient)
  {
    this._http = http;
    let lastPlayerId : number = Number(localStorage.getItem("currentPlayerId"));

    this.getPlayerById(lastPlayerId)
      .subscribe(value => this.activePlayer = value,
        () => localStorage.removeItem("currentPlayerId"));

  }

  getAvailablePlayers() : Observable<PlayerResponse[]>
  {
    return this._http.get<PlayerResponse[]>(`api/player`)
  }

  getPlayerById(playerId: number) : Observable<PlayerResponse>
  {
    return this._http.get<PlayerResponse>(`api/player/${playerId}`);
  }

  public addSongToPlaylist(songId: number) : Observable<void>
  {
    return this._http.post(`api/player/${this._activePlayer.id}/addSong/${songId}`,"")
      .map(() =>{});
  }

  public executePlayerCommand(cmd: PlayerCommandResponse) : Observable<void>
  {
    console.log(JSON.stringify(cmd));

    return this._http.post(`api/player/${this.activePlayer.id}/executeCommand`,JSON.stringify(cmd), {responseType: 'text'})
      .map(() => {});
  }

  private updatePlayerInfo()
  {
    this._http.get<PlayerResponse>(`api/player/${this._activePlayer.id}`)
      .subscribe(value => this.activePlayer = value,
        () => this.activePlayer = null);
  }

  private openNotificationSocket()
  {
    this._notificationSocket = new WebSocket(`ws://localhost:5000/api/player/${this._activePlayer.id}/notifications`);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      this._notificationSocket.onmessage = obs.next.bind(obs);
      this._notificationSocket.onerror = obs.error.bind(obs);
      this._notificationSocket.onclose = obs.complete.bind(obs);
      return this._notificationSocket.close.bind(this._notificationSocket);
    });

    let observer = {
      next: (data: Object) => {
        if (this._notificationSocket.readyState === WebSocket.OPEN) {
          this._notificationSocket.send(JSON.stringify(data));
        }
      }
    };

    let subject = Subject.create(observer, observable);

    subject.subscribe(value => this.handleSocketResponse(value)
      , err => PlayerService.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  private handleSocketResponse(event: MessageEvent)
  {
    this.updatePlayerInfo();
  }

  private static handleSocketError(error) {
    console.log(error);
  }

  private handleSocketCompleted()
  {
    console.log("Completed");
    this._notificationSocket = null;
    this.activePlayer = null;
  }

}
