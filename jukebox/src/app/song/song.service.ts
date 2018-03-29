import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {SongResponse} from "./models/song-response";

@Injectable()
export class SongService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  public searchForSongs(searchTerm: string) : Observable<SongResponse[]>
  {
    return this._http.get<any[]>(`api/song/search?searchTerm=${searchTerm}`);
  }

  public getSongByIdAsBlob(songId: number) : Observable<string>
  {
    return this._http.get(`api/song/${songId}`, { responseType: 'blob' })
      .map(value => URL.createObjectURL(value));
  }

  public getArtists(): Observable<string[]> {
    return this._http.get<string[]>('api/song/artists');
  }

}
