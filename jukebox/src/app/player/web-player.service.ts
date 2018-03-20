import {EventEmitter, Injectable} from '@angular/core';
import {PlayerService} from "./player.service";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "./models/player-response";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Observer} from "rxjs/Observer";
import {SongService} from "../song/song.service";
import {AuthenticationService} from "../security/authentication.service";
import {WebPlayerState} from "./models/web-player-state.enum";
import {PlayerCommandResponse} from "./models/player-command-response";
import {PlayerCommandTypes} from "./models/player-command-types.enum";
import {Router} from "@angular/router";

@Injectable()
export class WebPlayerService {
  private setState(value: WebPlayerState): void
  {
    this._state = value;
    if(this._player != null)
      this._player.state = value;
    this.updateUpstream();
  }

  private _audio;
  private _playerService: PlayerService;
  private _state = WebPlayerState.Closed;

  private _wsObservable: Subject<MessageEvent>;
  private _websocket: WebSocket;
  private _player: PlayerResponse;
  private _songCache: [number,string][] = [];

  //TODO export to environment
  private serverUrl = "ws://localhost:5000/api/player/ws";
  private _http: HttpClient;
  private _songService: SongService;
  private _router: Router;

  constructor(playerService: PlayerService, http: HttpClient, songService: SongService, router: Router)
  {
    this._playerService = playerService;
    this._http = http;
    this._songService = songService;
    this._router = router;
    this._audio = new Audio();
    this._audio.autoplay = false;
    this._audio.onended = () => this.next();
    this._audio.onerror = () => this.next();
  }


  private playPause()
  {
    switch(this._state){
      case WebPlayerState.Stopped: {
        let previousState = this._state;
        this.setState(WebPlayerState.Loading);
        return this.loadNextTrack()
          .subscribe(() => {
            this._audio.play();
            this.setState(WebPlayerState.Playing);
            console.log(`Duration: ${this._audio.duration}`);

          }, () => {
            this.setState(previousState);
          });
      }
        case WebPlayerState.Paused: {
          this._audio.play();
          this.setState(WebPlayerState.Playing);
          break;
        }

        case WebPlayerState.Playing:{
          this._audio.pause();
          this.setState(WebPlayerState.Paused);
          break;
        }
      }
    }

  private loadNextTrack() : Observable<void>
  {
    if(this._player.playlistIndex >= this._player.playlist.length)
      return Observable.throw("Playlist end reached");

    let canPreload = this._player.playlistIndex +1 < this._player.playlist.length;

    let currentId = this._player.playlist[this._player.playlistIndex].id;

    let nextId = undefined;

    if(canPreload)
      nextId = this._player.playlist[this._player.playlistIndex + 1].id;

    return this.loadTrackWithId(currentId)
      .do(() => {
        if(canPreload)
          this.loadTrackWithId(nextId)
            .subscribe();
      })
      .map(value => {
        this._songCache.push([currentId,value]);
        this._audio.src = value;
        this._audio.load();
      });

  }

  private loadTrackWithId(songId: number) : Observable<string>
  {
    let song = this._songCache.find(x => x[0] === songId);

    console.log(song);

    if(song === undefined)
      return this._songService.getSongByIdAsBlob(songId)
        .do(value => {
          this._songCache.push([songId,value]);
        });
    else
      return Observable.of(song[1]);
  }

  private stop()
  {
    if(this._state === WebPlayerState.Playing || this._state === WebPlayerState.Loading)
    {
      this._audio.pause();
      this._audio.currentTime = 0;
      this.setState(WebPlayerState.Stopped);
    }
  }

  private next()
  {
    this._player.playlistIndex += 1;
    this.updateUpstream();

    this.loadNextTrack().subscribe(() =>{
      this._audio.play();
    }, () => {
      console.log("error Thrown");
      this.stop();
    })
  }

  public createPlayer(name: string) {
    this.setState(WebPlayerState.Initializing);

    if (this._websocket != null)
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
      , err => WebPlayerService.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  private updateUpstream() {
    if (this._websocket != null) {
      console.log("Updated Upstream");
      this._websocket.send(JSON.stringify(this._player));
    }

  }

  private handleSocketResponse(event: MessageEvent)
  {
    let msg : PlayerCommandResponse = JSON.parse(event.data);

    // noinspection FallThroughInSwitchStatementJS
    switch (msg.Type)
    {
      default:{
        console.log(msg);
      }
      case PlayerCommandTypes.Init:{
        this._http.get<PlayerResponse>(`api/player/${msg.Arguments.find(x => x[0] == "playerId")[1]}`)
          .subscribe(value => {
            this._player = value;
            this.setState(WebPlayerState.Stopped);
            this._playerService.activePlayer = this._player;
            this._router.navigateByUrl("player/web");
          });
        break;
      }
      case PlayerCommandTypes.PlaylistUpdate:{
        this._http.get<PlayerResponse>(`api/player/${this._player.id}`)
          .subscribe(value => {
            this._player = value;
          });
        break;
      }

      case PlayerCommandTypes.JumpToIndex:{
        this._player.playlistIndex = Number(msg.Arguments.find(x => x[0] == "index")[1]);
        this.updateUpstream();
        this.loadNextTrack()
          .subscribe(() => this._audio.play()
          ,() => this.stop());
        break;
      }

      case PlayerCommandTypes.PlayPause:{
        this.playPause();
        break;
      }

      case PlayerCommandTypes.Stop:{
        this.stop();
        break;
      }
    }
  }

  private static handleSocketError(error) {
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

