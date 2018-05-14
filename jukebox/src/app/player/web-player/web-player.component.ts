import {Component, OnInit} from '@angular/core';
import {WebPlayerState} from "../models/web-player-state.enum";
import {PlayerService} from "../player.service";
import {PlayerResponse} from "../models/player-response";
import {PlayerCommandResponse} from "../models/player-command-response";
import {PlayerCommandTypes} from "../models/player-command-types.enum";
import {NotificationService} from "../../notification/notification.service";

@Component({
  selector: 'app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.css']
})
export class WebPlayerComponent implements OnInit {
  private _notificationService: NotificationService;
  get activePlayer(): PlayerResponse {
    return this._activePlayer;
  }

  get canStop(): boolean {
    return this._canStop;
  }

  get canPause(): boolean {
    return this._canPause;
  }

  get canPlay(): boolean {
    return this._canPlay;
  }

  get canNext(): boolean {
    return this._canNext;
  }

  get canPrevious(): boolean {
    return this._canPrevious;
  }


  private _canPrevious = false;
  private _canNext = false;
  private _canPlay = false;
  private _canPause = false;
  private _canStop = false;
  private _playerService: PlayerService;
  private _activePlayer : PlayerResponse;

  constructor(playerService: PlayerService, notificationService: NotificationService) {
    this._playerService = playerService;
    this._notificationService = notificationService;

    this.updatePlayer(this._playerService.activePlayer);
    this._playerService.activePlayerChanged
      .subscribe(value => this.updatePlayer(value));
  }

  ngOnInit() {
  }

  private updatePlayer(value: PlayerResponse)
  {
    this._activePlayer = value;

    switch (this._activePlayer.state){
      case WebPlayerState.Closed:
      case WebPlayerState.Initializing:{
        this._canPrevious = false;
        this._canNext = false;
        this._canPlay = false;
        this._canPause = false;
        this._canStop = false;
        break;
      }
      case WebPlayerState.Loading:{
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = false;
        this._canPause = false;
        this._canStop = true;
        break;
      }
      case WebPlayerState.Playing: {
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = false;
        this._canPause = true;
        this._canStop = true;
        break;
      }

      case WebPlayerState.Paused:
      {
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = true;
        this._canPause = false;
        this._canStop = true;
        break;
      }
      case WebPlayerState.Stopped:{
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = true;
        this._canPause = false;
        this._canStop = false;
        break;
      }
    }
  }

  playPause()
  {
    this._playerService.executePlayerCommand(new PlayerCommandResponse(PlayerCommandTypes.PlayPause))
      .subscribe();
  }

  next()
  {
    this._playerService.executePlayerCommand(new PlayerCommandResponse(PlayerCommandTypes.JumpToIndex, [["index", `${this._activePlayer.playlistIndex + 1}`]]))
      .subscribe();
  }

  previous()
  {
    this._playerService.executePlayerCommand(new PlayerCommandResponse(PlayerCommandTypes.JumpToIndex, [["index", `${this._activePlayer.playlistIndex - 1}`]]))
      .subscribe();
  }

  stop()
  {
    this._playerService.executePlayerCommand(new PlayerCommandResponse(PlayerCommandTypes.Stop))
      .subscribe();
  }
}
