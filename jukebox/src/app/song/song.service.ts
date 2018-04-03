import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {SongResponse} from "./models/song-response";
import {ArtistResponse} from "./models/artist-response";
import {AlbumResponse} from "./models/album-response";
import {ElectronService} from "ngx-electron";
import universalParse from 'id3-parser/lib/universal';


@Injectable()
export class SongService {
  private _http: HttpClient;
  private _electronService: ElectronService;

  constructor(http: HttpClient, electronService: ElectronService) {
    this._http = http;
    this._electronService = electronService;
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

  public getArtists(): Observable<ArtistResponse[]> {
    return this._http.get<ArtistResponse[]>('api/song/artists');
  }

  public getAlbums() : Observable<AlbumResponse[]>
  {
    return this._http.get<AlbumResponse[]>('api/song/albums');
  }

  public getSongs(): Observable<SongResponse[]> {
    return this._http.get<SongResponse[]>('api/song/songs');
  }

  public getFileSystem() {
    if (!this._electronService.isElectronApp)
      return;

    let fs = this._electronService.remote.require('fs');

    console.log("fs hit");

    fs.readFile('C:/Alderaan/temp/test.txt', (err, data) => {
      if (err)
        throw err;

      console.log(data);
    });

    //let stream = fs.createReadStream('M:/Music/Amaranthe/2011 - Amaranthe/01 - Leave Everything Behind.mp3');

    fs.readFile('M:/Music/Amaranthe/2011 - Amaranthe/01 - Leave Everything Behind.mp3', (err, data) => {
      if (err)
        throw err;

      universalParse(data)
        .then(tag => {
          console.log(tag);
        })
        .catch(error => console.error(error));
    });

  }
}
