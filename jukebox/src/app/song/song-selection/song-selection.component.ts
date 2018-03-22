import {Component, OnInit} from '@angular/core';
import {SongResponse} from "../models/song-response";
import {PlayerService} from "../../player/player.service";
import {SongService} from "../song.service";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-song-selection',
  templateUrl: './song-selection.component.html',
  styleUrls: ['./song-selection.component.scss']
})
export class SongSelectionComponent implements OnInit {

  // noinspection JSMismatchedCollectionQueryUpdate
  private _availableSongs: SongResponse[];
  private _playerService: PlayerService;
  private _songService: SongService;

  private searchSubject = new Subject<string>();

  constructor(playerService: PlayerService, songService: SongService) {
    this._playerService = playerService;
    this._songService = songService;

    this.searchSubject.asObservable()
      .debounceTime(500)
      .mergeMap(value => this._songService.searchForSongs(value))
      .catch(() => {
        return Observable.of([])
      })
      .subscribe(songs => {
          this._availableSongs = songs;
        });
  }

  ngOnInit() {
  }

  songSelected(song: SongResponse) : void
  {
    this._playerService.addSongToPlaylist(song.id).subscribe();
  }

  searchBarTyped(searchString: string)
  {
    this.searchSubject.next(searchString);
  }
}
