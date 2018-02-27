import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Song} from "./models/song";

@Injectable()
export class SongService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  public searchForSongs(searchTerm: string) : Observable<Song[]>
  {
    return this._http.get<any[]>(`api/song/search?searchTerm=${searchTerm}`)
      .map(x => {
        let songs = [];
        x.forEach(function (song: any) {
          songs.push(new Song(song.id,song.title,song.artists[0], song.album))
        });
        return songs;
      });
  }

}
