import {Component, OnInit} from '@angular/core';
import {SongService} from "../song.service";

@Component({
  selector: 'app-song-selection',
  templateUrl: './song-selection.component.html',
  styleUrls: ['./song-selection.component.scss']
})
export class SongSelectionComponent implements OnInit {
  private _songService: SongService;

  constructor(songService: SongService) {
    this._songService = songService;

  }

  ngOnInit(): void {
  }

}
