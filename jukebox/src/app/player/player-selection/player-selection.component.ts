import { Component, OnInit } from '@angular/core';
import {AudioPlayer} from "../models/audio-player";
import {PlayerService} from "../player.service";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

@Component({
  selector: 'app-player-selection',
  templateUrl: './player-selection.component.html',
  styleUrls: ['./player-selection.component.css']
})
export class PlayerSelectionComponent implements OnInit {

  _activePlayer: AudioPlayer;
  _availalbePlayers: AudioPlayer[];
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
      .catch(err => {
        console.log(err);
        return Observable.of([new AudioPlayer("Fallback","Fallback")]);
      })
      .subscribe(value => this._availalbePlayers = value);
  }

  private selectPlayer(player: AudioPlayer)
  {
    this._activePlayer = player;
    this._playerService.activePlayer = player;
    this._router.navigateByUrl("/home");
  }
}