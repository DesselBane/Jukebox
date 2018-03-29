import {Component, Input, OnInit} from '@angular/core';
import {SongService} from "../song.service";
import {AlbumResponse} from "../models/album-response";

@Component({
  selector: 'app-album-overview',
  templateUrl: './album-overview.component.html',
  styleUrls: ['./album-overview.component.css']
})
export class AlbumOverviewComponent implements OnInit {

  private _albums: AlbumResponse[] = [];
  private _alphabet: string[] = [];
  private _songService: SongService;

  constructor(songService: SongService)
  {
    this._songService = songService;

    songService.getAlbums().subscribe(value => this._albums = value);

    let start = 'A'.charCodeAt(0);

    for (let i = 0; i < 26; i++) {
      this._alphabet.push(String.fromCharCode(start + i));
    }



  }

  ngOnInit() {
  }

  public getAlbumByLetter(letter: string)
  {
    return this._albums.filter(x => x.name.charAt(0).toUpperCase() === letter);
  }

}
