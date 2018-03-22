import { Component, OnInit } from '@angular/core';
import {PlayerService} from "../player.service";
import {PlayerResponse} from "../models/player-response";
import {SongResponse} from "../../song/models/song-response";

@Component({
  selector: 'app-current-player-status',
  templateUrl: './current-player-status.component.html',
  styleUrls: ['./current-player-status.component.scss']
})
export class CurrentPlayerStatusComponent implements OnInit {

  private set activePlayer(value: PlayerResponse) {
    this._activePlayer = value;
    this._currentSong = this._activePlayer.playlist[this._activePlayer.playlistIndex];
  }
  private _playerService: PlayerService;

  private _activePlayer: PlayerResponse;
  private _currentSong: SongResponse;

  constructor(playerService: PlayerService) {
    this._playerService = playerService;
    this.activePlayer = this._playerService.activePlayer;
    this._playerService.activePlayerChanged
      .subscribe(value => this.activePlayer = value);
  }

  ngOnInit() {

  }

}
