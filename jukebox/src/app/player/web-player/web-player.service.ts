import {Injectable} from '@angular/core';
import {PlayerService} from "../player.service";
import * as Rx from 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "../models/player-response";

@Injectable()
export class WebPlayerService {
  get paused(): boolean {
    return this._paused;
  }

  private _audio;
  private _currentId = 3760;
  private _paused = true;
  private _playerService: PlayerService;
  private wsObservable: Rx.Subject<MessageEvent>;

  private serverUrl = "ws://localhost:5000/api/player/ws";
  private _http: HttpClient;

  private _websocket: WebSocket;

  constructor(playerService: PlayerService, http: HttpClient) {
    this._playerService = playerService;
    this._http = http;
    this._audio = new Audio();
    this._audio.autostart = false;
  }

  public testWebsocket(name: string) {
    if (this._websocket)
      return;

    this._websocket = new WebSocket(this.serverUrl);

    let observable = Rx.Observable.create((obs: Rx.Observer<MessageEvent>) => {
      this._websocket.onmessage = obs.next.bind(obs);
      this._websocket.onerror = obs.error.bind(obs);
      this._websocket.onclose = obs.complete.bind(obs);
      return this._websocket.close.bind(this._websocket);
    });

    let observer = {
      next: (data: Object) => {
        if (this._websocket.readyState === WebSocket.OPEN) {
          this._websocket.send(JSON.stringify(data));
        }
      }
    };

    this.wsObservable = Rx.Subject.create(observer, observable);

    this.wsObservable.subscribe(value => console.log(value.data)
      , error => console.log(error)
      , () => console.log("Completed"));

    this._websocket.onopen = () => {
      this._websocket.send(JSON.stringify({
        PlayerName: "Test Player tha first"
      }));
    };
  }

}

