import {Injectable} from '@angular/core';
import {PlayerService} from "../player.service";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "../models/player-response";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Observer} from "rxjs/Observer";
import {SongService} from "../../song/song.service";
import {AuthenticationService} from "../../security/authentication.service";

@Injectable()
export class WebPlayerService {
  get player(): PlayerResponse {
    return this._player;
  }
  get paused(): boolean {
    return this._paused;
  }

  private _audio;
  private _paused = true;
  private _playerService: PlayerService;

  private _wsObservable: Subject<MessageEvent>;
  private _websocket: WebSocket;
  private _player: PlayerResponse;

  //TODO export to environment
  private serverUrl = "ws://localhost:5000/api/player/ws";
  private _http: HttpClient;
  private _songService: SongService;


  constructor(playerService: PlayerService, http: HttpClient, songService: SongService) {
    this._playerService = playerService;
    this._http = http;
    this._songService = songService;
    this._audio = new Audio();
    this._audio.autostart = false;
  }

  public createPlayer(name: string)
  {
    if(this._websocket != null)
      throw "Player already created";

    this._websocket = new WebSocket(this.serverUrl);

    this._websocket.onopen = () => {
      this._websocket.send(JSON.stringify({
        PlayerName: name,
        AccessToken: AuthenticationService.loginToken.accessToken
      }));
    };

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
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

    this._wsObservable = Subject.create(observer, observable);

    this._wsObservable.subscribe(value => this.handleSocketResponse(value)
      , err => this.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  public playPause()
  {
    if(this._paused)
    {
      this._audio.play();
      this._paused = false;
    }
    else
    {
      this._audio.pause();
      this._paused = true;
    }
  }

  private loadAudio() : Observable<void>
  {
    if(this._player == null)
      return Observable.of();

    return this._songService.getSongByIdAsBlob(this._player.playlist[this._player.playlistIndex].id)
      .map(value => {
        this._audio.src = value;
        this._audio.load();
      });
  }

  private handleSocketResponse(event: MessageEvent)
  {
    console.log(event);
    console.log(event.data);

    let msg = JSON.parse(event.data);

    switch (msg.type)
    {
      default:{
        console.log(msg);
      }
      case "init":{
        console.log(this);
        this.handlePlayerInit(msg);
        break;
      }
      case "update":{
        this.handlePlayerUpdate(msg);
        break;
      }


    }
  }

  private handlePlayerInit(msg)
  {
    this._http.get<PlayerResponse>(`api/player/${msg.playerId}`)
      .subscribe(value => this._player = value);
  }

  private handlePlayerUpdate(msg: any)
  {
    console.log("player updated");

    this._http.get<PlayerResponse>(`api/player/${this._player.id}`)
      .subscribe(value => {
        this._player = value;
        this.loadAudio().subscribe();
      });
  }

  private handleSocketError(error)
  {
    console.log(error);
  }

  private handleSocketCompleted()
  {
    console.log("Completed");
    this._websocket = null;
    this._wsObservable = null;
    this._player = null;
    this._audio.pause();
    this._paused = true;
  }


}

