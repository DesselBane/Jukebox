import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {SongResponse} from './models/song-response';
import {ArtistResponse} from './models/artist-response';
import {AlbumResponse} from './models/album-response';
import {ElectronService} from 'ngx-electron';
import {map} from 'rxjs/operators';


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
      .pipe(map(value => URL.createObjectURL(value)));
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

  public getAlbumsOfArtist(artistId: number): Observable<AlbumResponse[]> {
    return this._http.get<AlbumResponse[]>(`api/song/albums/ofArtist/${artistId}`);
  }

  public getArtistById(artistId: number): Observable<ArtistResponse> {
    return this._http.get<ArtistResponse>(`api/song/artists/${artistId}`);
  }

  public getSongsOfAlbum(albumId: number): Observable<SongResponse[]> {
    return this._http.get<SongResponse[]>(`api/song/songs/ofAlbum/${albumId}`);
  }

  public getAlbumById(albumId: number): Observable<AlbumResponse> {
    return this._http.get<AlbumResponse>(`api/song/albums/${albumId}`);
  }


}
