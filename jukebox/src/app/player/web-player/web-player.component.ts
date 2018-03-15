import { Component, OnInit } from '@angular/core';
import {WebPlayerService} from "./web-player.service";

@Component({
  selector: 'app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.css']
})
export class WebPlayerComponent implements OnInit {
  get paused(): boolean {
    return this._webPlayerService.paused;
  }

  private _webPlayerService;

  constructor(webPlayerService: WebPlayerService) {
    this._webPlayerService = webPlayerService;

  }

  ngOnInit() {
  }

  playPause()
  {
    this._webPlayerService.playPause();
  }

  next()
  {

  }

  previous()
  {

  }

  createPlayer()
  {
    this._webPlayerService.createPlayer("Test Player tha second");
  }

}
