import {Component, OnInit} from '@angular/core';
import {SongService} from "../song.service";
import {SongResponse} from "../models/song-response";

@Component({
  selector: 'app-song-overview',
  templateUrl: './song-overview.component.html',
  styleUrls: ['./song-overview.component.css']
})
export class SongOverviewComponent implements OnInit {

  private songs: SongResponse[] = [];
  private _alphabet: string[] = [];
  private _songService: SongService;

  constructor(songService: SongService) {
    this._songService = songService;

    songService.getSongs().subscribe(value => this.songs = value);

    let start = 'A'.charCodeAt(0);

    for (let i = 0; i < 26; i++) {
      this._alphabet.push(String.fromCharCode(start + i));
    }


  }

  ngOnInit() {
  }

  public getSongByLetter(letter: string) {
    return this.songs.filter(x => x.title.charAt(0).toUpperCase() === letter);
  }

}
