import {Component, OnInit} from '@angular/core';
import {WebPlayerService} from "../web-player.service";
import {StringExtensions} from "../../extensions/StringExtensions";

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.css']
})
export class CreatePlayerComponent implements OnInit {

  playername: string;
  isWorking = false;
  private _webPlayerService: WebPlayerService;

  constructor(webPlayerService: WebPlayerService) {
    this._webPlayerService = webPlayerService;
  }

  ngOnInit() {
  }

  createPlayer() {
    if (StringExtensions.isNullOrWhitespace(this.playername))
      return;

    this.isWorking = true;
    this._webPlayerService.createPlayer(this.playername);

  }
}
