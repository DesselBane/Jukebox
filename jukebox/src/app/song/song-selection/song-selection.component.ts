import { Component, OnInit } from '@angular/core';
import {Song} from "../models/song";
import {PlayerService} from "../../player/player.service";

@Component({
  selector: 'app-song-selection',
  templateUrl: './song-selection.component.html',
  styleUrls: ['./song-selection.component.scss']
})
export class SongSelectionComponent implements OnInit {

  private _availableSongs: Song[];
  private _playerService: PlayerService;

  constructor(playerService: PlayerService) {
    this._playerService = playerService;
    this._availableSongs = [
      new Song("Meadows of Heaven","Nightwish","Dark Pasion Play"),
      new Song("Song of Myself","Nightwish","Imaginaerum")
    ];
  }

  ngOnInit() {
  }

  songSelected(song: Song) : void
  {
    this._playerService.addSongToPlaylist(song);
  }
}
