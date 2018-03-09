import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.css']
})
export class WebPlayerComponent implements OnInit {

  private _audio;
  private _currentId = 10;
  private _paused = true;
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
    this._audio = new Audio();
   this.load();
  }

  private load()
  {

    this._audio.src = `http://localhost:5000/api/song/${this._currentId}`;

    this._audio.load();
  }

  ngOnInit() {
  }

  playPause()
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

  next()
  {
    this._currentId += 1;
    this.load();
    this._audio.play();
  }

  previous()
  {
    this._currentId -= 1;
    this.load();
    this._audio.play();
  }

}
