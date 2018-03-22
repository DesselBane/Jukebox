import {Component, OnInit} from '@angular/core';
import {PlayerService} from "../player.service";
import {Router} from "@angular/router";
import {PlayerResponse} from "../models/player-response";

@Component({
  selector: 'app-player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit {

  _activePlayer: PlayerResponse;
  _availalbePlayers: PlayerResponse[];
  private _playerService: PlayerService;
  private _router: Router;

  constructor(playerService: PlayerService, router: Router) {
    this._playerService = playerService;
    this._router = router;
  }

  ngOnInit() {
    this.loadPlayers();
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
