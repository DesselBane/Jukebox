import { Component, OnInit } from '@angular/core';
import {PlayerService} from "../player.service";
import {PlayerResponse} from "../models/player-response";

@Component({
  selector: 'app-current-player-status',
  templateUrl: './current-player-status.component.html',
  styleUrls: ['./current-player-status.component.scss']
})
export class CurrentPlayerStatusComponent implements OnInit {
  private _playerService: PlayerService;

  private _activePlayer: PlayerResponse;

  constructor(playerService: PlayerService) {
    this._playerService = playerService;
  }

  ngOnInit() {
    this._activePlayer = this._playerService.activePlayer;
    this._playerService.activePlayerObservable
      .subscribe(value => this._activePlayer = value);
  }

}
