import {EventEmitter, Injectable} from '@angular/core';
import {PlayerService} from "../player.service";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "../models/player-response";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Observer} from "rxjs/Observer";
import {SongService} from "../../song/song.service";
import {AuthenticationService} from "../../security/authentication.service";
import {WebPlayerState} from "./web-player-state.enum";

@Injectable()
export class WebPlayerService {
  get stateChanged(): EventEmitter<WebPlayerState> {
    return this._stateChanged;
  }

  get state(): WebPlayerState {
    return this._state;
  }

  private setState(value: WebPlayerState): void
  {
    this._state = value;
    this._stateChanged.emit(this._state);
    console.log(value);
  }

  get player(): PlayerResponse {
    return this._player;
  }

  private _audio;
  private _playerService: PlayerService;
  private _state = WebPlayerState.Closed;
  private _stateChanged = new EventEmitter<WebPlayerState>();

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
    this._audio.onended = () => this.next();
  }

  public createPlayer(name: string)
  {
    this.setState(WebPlayerState.Initializing);

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
    if(this.state === WebPlayerState.Paused || this.state === WebPlayerState.Stopped)
    {
      let previousState = this.state;
      this.setState(WebPlayerState.Loading);
      return this.loadNextTrack()
        .subscribe(() =>{
          this._audio.play();
          this.setState(WebPlayerState.Playing);
        }, () => {
          this.setState(previousState);
        });
    }
    else
    {
      this._audio.pause();
      this.setState(WebPlayerState.Paused);
    }
  }

  private loadNextTrack() : Observable<void>
  {
    if(this._player.playlistIndex >= this._player.playlist.length)
      return Observable.throw("Playlist end reached");

    let canPreload = this._player.playlistIndex +1 >= this._player.playlist.length;

    return this._songService.getSongByIdAsBlob(this._player.playlist[this._player.playlistIndex].id)
      .map(value => {
        this._audio.src = value;
        this._audio.load();
      })
      .do(() => {
        if(canPreload)
          this._songService.getSongByIdAsBlob(this._player.playlist[this._player.playlistIndex].id)
            .subscribe();
      });

  }

  public stop()
  {
    if(this.state === WebPlayerState.Playing || this.state === WebPlayerState.Loading)
    {
      this._audio.pause();
      this._audio.currentTime = 0;
      this.setState(WebPlayerState.Stopped);
    }
  }

  public next()
  {
    this._player.playlistIndex += 1;

    //TODO update upstream

    this.loadNextTrack().subscribe(() =>{
      this._audio.play();
    }, () => {
      stop();
    })
  }

  private handleSocketResponse(event: MessageEvent)
  {
    let msg = JSON.parse(event.data);

    switch (msg.type)
    {
      default:{
        console.log(msg);
      }
      case "init":{
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
      .subscribe(value => {
        this._player = value;
        this.setState(WebPlayerState.Stopped);
      });
  }

  private handlePlayerUpdate(msg: any)
  {
    console.log("player updated");

    this._http.get<PlayerResponse>(`api/player/${this._player.id}`)
      .subscribe(value => {
        this._player = value;
        this.setState(WebPlayerState.Stopped);
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
    this.setState(WebPlayerState.Closed)
  }
}

