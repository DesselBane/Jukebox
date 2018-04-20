import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {HttpClient} from "@angular/common/http";
import {PlayerResponse} from "./models/player-response";
import {PlayerCommandResponse} from "./models/player-command-response";
import {NotificationService} from "../notification/notification.service";
import {NotificationChannels} from "../notification/models/notification-channels.enum";
import {NotificationResponse} from "../notification/models/notification-response";
import {ElectronService} from "ngx-electron";
import {WebPlayerService} from "./web-player.service";
import {NavigationService} from "../navigation/navigation.service";
import {SongResponse} from "../song/models/song-response";

@Injectable()
export class PlayerService {
  private _electronService: ElectronService;
  private _webPlayerService: WebPlayerService;
  get activePlayerChanged(): EventEmitter<PlayerResponse> {
    return this._activePlayerChanged;
  }

  get activePlayer(): PlayerResponse {
    return this._activePlayer;
  }

  private _navigationService: NavigationService;
  private _activePlayer: PlayerResponse;
  private _activePlayerChanged = new EventEmitter<PlayerResponse>();
  private _http: HttpClient;
  private _notificationService: NotificationService;

  constructor(http: HttpClient, notificationService: NotificationService, electronService: ElectronService, webPlayerService: WebPlayerService, navigationService: NavigationService)
  {
    this._http = http;
    this._notificationService = notificationService;
    this._electronService = electronService;
    this._webPlayerService = webPlayerService;
    this._navigationService = navigationService;

    this._webPlayerService.activePlayerChanged.subscribe(player => this.activePlayer = player);

    let lastPlayerId : number = Number(localStorage.getItem("currentPlayerId"));

    this.getPlayerById(lastPlayerId)
      .subscribe(value => this.activePlayer = value,
        () => {
          localStorage.removeItem("currentPlayerId");
          if (this._electronService.isElectronApp)
            this.createDefaultPlayer();
        });

    notificationService.subscribeToChannel(NotificationChannels.PlayerInfo)
      .filter((notification: NotificationResponse) => {
        let playerId = notification.Arguments.find(x => x[0] === "playerId");
        return playerId != null && this._activePlayer != null && Number(playerId[1]) === this._activePlayer.id;
      })
      .subscribe(() => this.updatePlayerInfo()
        , () => {
        }
        , () => this.handleSocketCompleted());
  }

  get currentSong(): SongResponse {
    if (this._activePlayer != null)
      return this._activePlayer.playlist[this._activePlayer.playlistIndex];
  }

  set activePlayer(value: PlayerResponse) {
    this._activePlayer = value;
    this._activePlayerChanged.emit(this._activePlayer);
    localStorage.setItem("currentPlayerId", String(this._activePlayer.id));
    if (this.currentSong != null)
      this._navigationService.updateSysTrayToolTip(this.currentSong.title);
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

  private handleSocketCompleted()
  {
    console.log("Completed");
    this.activePlayer = null;
  }

  private createDefaultPlayer() {
    this._webPlayerService.createPlayer('Local Player');
  }
}
