import {Component, OnInit} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {PlayerService} from "../../player/player.service";
import {Observable} from "rxjs/Observable";
import {SongResponse} from "../models/song-response";
import {SongService} from "../song.service";

@Component({
  selector: 'app-song-search',
  templateUrl: './song-search.component.html',
  styleUrls: ['./song-search.component.scss']
})
export class SongSearchComponent implements OnInit {
  get availableSongs(): SongResponse[] {
    return this._availableSongs;
  }

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

  songSelected(song: SongResponse): void {
    this._playerService.addSongToPlaylist(song.id).subscribe();
  }

  searchBarTyped(searchString: string) {
    this.searchSubject.next(searchString);
  }

}
