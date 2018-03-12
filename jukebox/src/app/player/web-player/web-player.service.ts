import { Injectable } from '@angular/core';
import {PlayerService} from "../player.service";
import {Observable} from "rxjs/Observable";

@Injectable()
export class WebPlayerService {
  get paused(): boolean {
    return this._paused;
  }

  private _audio;
  private _currentId = 3760;
  private _paused = true;
  private _playerService: PlayerService;

  constructor(playerService: PlayerService) {
    this._playerService = playerService;
    this._audio = new Audio();
    this._audio.autostart = false;
    this.load();
  }

  private load() : Observable<void>
  {
    return this._playerService.getNextSong(this._currentId)
      .do(x => {
        this._audio.src = x;
        this._audio.load();
      })
      .map(() => {});
  }

  public playPause()
  {
    if(this._paused)
    {
      this._paused = false;
      this._audio.play();
    }else
    {
      this._paused = true;
      this._audio.pause();
    }
  }

  public next()
  {
    this._currentId += 1;
    this.load().subscribe(() => {
      this._audio.play();
    });

  }

  public previous()
  {
    this._currentId -= 1;
    this.load().subscribe(() => {
      this._audio.play();
    });
  }

}
