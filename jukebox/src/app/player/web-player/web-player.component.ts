import {Component, OnInit} from '@angular/core';
import {WebPlayerState} from "../models/web-player-state.enum";
import {PlayerService} from "../player.service";
import {PlayerResponse} from "../models/player-response";
import {PlayerCommandResponse} from "../models/player-command-response";
import {PlayerCommandTypes} from "../models/player-command-types.enum";
import {UserNotification} from "../../notification/models/user-notification";
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
    console.log(value);
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
    let cmd = new PlayerCommandResponse();
    cmd.Type = PlayerCommandTypes.PlayPause;

    this._playerService.executePlayerCommand(cmd)
      .subscribe();
  }

  next()
  {
    let cmd = new PlayerCommandResponse();
    cmd.Type = PlayerCommandTypes.JumpToIndex;
    cmd.Arguments.push(["index",`${this._activePlayer.playlistIndex + 1}`]);

    this._playerService.executePlayerCommand(cmd)
      .subscribe();
  }

  previous()
  {
    let cmd = new PlayerCommandResponse();
    cmd.Type = PlayerCommandTypes.JumpToIndex;
    cmd.Arguments.push(["index",`${this._activePlayer.playlistIndex - 1}`]);

    this._playerService.executePlayerCommand(cmd)
      .subscribe();
  }

  stop()
  {
    let cmd = new PlayerCommandResponse();
    cmd.Type = PlayerCommandTypes.Stop;

    this._playerService.executePlayerCommand(cmd)
      .subscribe();
  }

  clickMe() {
    this._notificationService.displayUserNotification(new UserNotification());
  }
}
