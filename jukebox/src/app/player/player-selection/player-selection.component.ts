import { Component, OnInit } from '@angular/core';
import {PlayerService} from "../player.service";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {PlayerResponse} from "../models/player-response";
import {WebPlayerService} from "../web-player.service";

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
  private _webPlayerService: WebPlayerService;

  constructor(playerService: PlayerService, router: Router, webPlayerService: WebPlayerService) {
    this._playerService = playerService;
    this._router = router;
    this._webPlayerService = webPlayerService;
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

  private selectPlayer(player: PlayerResponse)
  {
    this._activePlayer = player;
    this._playerService.activePlayer = player;
    this._router.navigateByUrl("/home");
  }

  createPlayer(name: string)
  {
    this._webPlayerService.createPlayer(name);
  }
}
