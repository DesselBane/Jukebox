import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SongService} from "../song.service";
import {ArtistResponse} from "../models/artist-response";
import {AlbumResponse} from "../models/album-response";

@Component({
  selector: 'app-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrls: ['./artist-details.component.css']
})
export class ArtistDetailsComponent implements OnInit {
  private _songService: SongService;
  private _route: ActivatedRoute;

  constructor(route: ActivatedRoute, songService: SongService) {
    this._route = route;
    this._songService = songService;
  }

  private _albums: AlbumResponse[];

  get albums(): AlbumResponse[] {
    return this._albums;
  }

  private _selectedArtist: ArtistResponse;

  get selectedArtist(): ArtistResponse {
    return this._selectedArtist;
  }

  ngOnInit() {
    let artistId = +this._route.snapshot.paramMap.get('artistId');
    this._songService
      .getArtistById(artistId)
      .subscribe(value => this._selectedArtist = value);
    this._songService
      .getAlbumsOfArtist(artistId)
      .subscribe(values => this._albums = values);

  }

}
