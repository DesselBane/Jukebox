import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class SettingsService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  public getMusicPaths(): Observable<string[]> {
    return this._http.get<string[]>('api/settings/musicPaths');
  }

  public setMusicPaths(paths: string[]): Observable<void> {
    return this._http.post('api/settings/musicPaths', JSON.stringify(paths))
      .map(() => {
      });
  }

}
