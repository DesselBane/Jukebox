import {Component, Input, OnInit} from '@angular/core';
import {SongResponse} from "../models/song-response";
import {PlayerService} from "../../player/player.service";

@Component({
  selector: 'app-song-list-view-model',
  templateUrl: './song-list-view-model.component.html',
  styleUrls: ['./song-list-view-model.component.css']
})
export class SongListViewModelComponent implements OnInit {

  @Input()
  public Song: SongResponse;

  private _playerService: PlayerService;

  constructor(playerService: PlayerService) {
    this._playerService = playerService;
  }

  ngOnInit() {
  }

  songSelected(): void {
    console.log(this.Song);
    this._playerService.addSongToPlaylist(this.Song.id).subscribe();
  }

}
