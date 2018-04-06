import {Component, OnInit} from '@angular/core';
import {SongService} from "../song.service";
import {ArtistResponse} from "../models/artist-response";

@Component({
  selector: 'app-artist-overview',
  templateUrl: './artist-overview.component.html',
  styleUrls: ['./artist-overview.component.css']
})
export class ArtistOverviewComponent implements OnInit {
  get alphabet(): string[] {
    return this._alphabet;
  }

  // noinspection JSMismatchedCollectionQueryUpdate
  private _alphabet: string[] = [];
  private _artists: ArtistResponse[] = [];
  private _songService: SongService;

  constructor(songService: SongService) {
    this._songService = songService;

    songService.getArtists().subscribe(value => this._artists = value);

    let start = 'A'.charCodeAt(0);

    for (let i = 0; i < 26; i++) {
      this._alphabet.push(String.fromCharCode(start + i));
    }


  }

  ngOnInit() {
  }


  getArtistsWithLetter(letter: string) {
    return this._artists.filter(x => x.name.charAt(0).toUpperCase() === letter);
  }

}
