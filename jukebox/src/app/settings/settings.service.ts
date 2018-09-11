import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';

@Injectable()
export class SettingsService {
  private _isIndexing = false;
  private _http: HttpClient;

  get isIndexing(): boolean {
    return this._isIndexing;
  }

  constructor(http: HttpClient) {
    this._http = http;
  }

  public getMusicPaths(): Observable<string[]> {
    return this._http.get<string[]>('api/settings/musicPaths');
  }

  public setMusicPaths(paths: string[]): Observable<void> {
    return this._http.post('api/settings/musicPaths', JSON.stringify(paths))
      .pipe(map(() => {
      }));
  }

  public startIndexing(): Observable<void> {
    this._isIndexing = true;

    return this._http.post('api/song/index', "")
      .pipe(
        map(() => {
        }),
        tap(() => this._isIndexing = false)
      );
  }

}
