import {Component, OnDestroy, OnInit} from '@angular/core';
import {PlayerService} from '../player.service';
import {Router} from '@angular/router';
import {PlayerResponse} from '../models/player-response';
import {NotificationService} from '../../notification/notification.service';
import {NotificationChannels} from '../../notification/models/notification-channels.enum';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit, OnDestroy {


  _activePlayer: PlayerResponse;
  _availalbePlayers: PlayerResponse[];
  private _playerService: PlayerService;
  private _router: Router;
  private _notificationService: NotificationService;
  private _subscription: Subscription;

  constructor(playerService: PlayerService, router: Router, notificationService: NotificationService) {
    this._playerService = playerService;
    this._router = router;
    this._notificationService = notificationService;
  }

  ngOnInit() {
    this.loadPlayers();
    this._subscription = this._notificationService.subscribeToChannel(NotificationChannels.AvailablePlayers)
      .subscribe(() => this.loadPlayers());
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
    this._subscription = null;
  }

  private loadPlayers()
  {
    this._activePlayer = this._playerService.activePlayer;
    this._playerService.getAvailablePlayers()
      .subscribe(value => this._availalbePlayers = value);
  }

  selectPlayer(player: PlayerResponse): void
  {
    this._activePlayer = player;
    this._playerService.activePlayer = player;
    this._router.navigateByUrl("/home");
  }

}
