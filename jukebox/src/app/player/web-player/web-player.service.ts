import {Injectable} from '@angular/core';
import {PlayerService} from "../player.service";
import * as Rx from 'rxjs/Rx';
import {HttpClient} from "@angular/common/http";

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
    this.load();
  }

  private load(): Rx.Observable<void> {
    return this._playerService.getNextSong(this._currentId)
      .do(x => {
        this._audio.src = x;
        this._audio.load();
      })
      .map(() => {
      });
  }

  public playPause() {
    this.testWebsocket("Test Player");
    /*if(this._paused)
    {
      this._paused = false;
      this._audio.play();
    }else
    {
      this._paused = true;
      this._audio.pause();
    }*/
  }

  public next() {
    if (this._websocket) {
      console.log("Closing websocket 2");
      this._websocket.close();
      this._websocket = null;
    }

    /* this._currentId += 1;
     this.load().subscribe(() => {
       this._audio.play();
     });
 */
  }

  public previous() {
    /*this._currentId -= 1;
    this.load().subscribe(() => {
      this._audio.play();
    });*/

    return this._http.get<PlayerResponse>("api/player")
      .subscribe(value => {
        console.log(value);
      });
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
          console.log("Sending data");
          console.log(data);
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


    /*return this._http.put<string>("/api/player",JSON.stringify({
      id: 0,
      name: name
    }))
      .subscribe(x => {
          this._websocket = new WebSocket(this.serverUrl + "?playerGuid=" + x);
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

          this.wsObservable = Rx.Subject.create(observer,observable);

          this.wsObservable.subscribe(value => console.log(value.data)
            , error => console.log(error)
            , () => console.log("Completed"));
        },
        error => {console.log(error)},
        () => console.log("Create Player done"));*/
  }

}

export interface PlayerResponse{
  id: string,
  name: string
}
