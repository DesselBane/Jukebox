import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {SongService} from "../song.service";
import {AlbumResponse} from "../models/album-response";
import {SongResponse} from "../models/song-response";

@Component({
  selector: 'app-album-details',
  templateUrl: './album-details.component.html',
  styleUrls: ['./album-details.component.css']
})
export class AlbumDetailsComponent implements OnInit {
  private _route: ActivatedRoute;
  private _songService: SongService;

  constructor(route: ActivatedRoute, songService: SongService) {
    this._route = route;
    this._songService = songService;
  }

  private _selectedAlbum: AlbumResponse;

  get selectedAlbum(): AlbumResponse {
    return this._selectedAlbum;
  }

  private _songs: SongResponse[];

  get songs(): SongResponse[] {
    return this._songs;
  }

  ngOnInit() {
    let albumId = +this._route.snapshot.paramMap.get('albumId');
    this._songService
      .getAlbumById(albumId)
      .subscribe(value => this._selectedAlbum = value);
    this._songService
      .getSongsOfAlbum(albumId)
      .subscribe(value => this._songs = value);
  }

}
