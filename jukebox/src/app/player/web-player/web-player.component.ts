import {Component, OnInit} from '@angular/core';
import {WebPlayerService} from "../web-player.service";
import {WebPlayerState} from "../web-player-state.enum";

@Component({
  selector: 'app-web-player',
  templateUrl: './web-player.component.html',
  styleUrls: ['./web-player.component.css']
})
export class WebPlayerComponent implements OnInit {

  private _webPlayerService;
  private _state: WebPlayerState;
  private _canPrevious = false;
  private _canNext = false;
  private _canPlay = false;
  private _canPause = false;
  private _canStop = false;

  constructor(webPlayerService: WebPlayerService) {
    this._webPlayerService = webPlayerService;
    this.updatePlayerState(this._webPlayerService.state);
    this._webPlayerService.stateChanged
      .subscribe(value => this.updatePlayerState(value));

  }

  ngOnInit() {
  }

  private updatePlayerState(value: WebPlayerState)
  {
    this._state = value;

    switch (value){
      case WebPlayerState.Closed:
      case WebPlayerState.Initializing:{
        this._canPrevious = false;
        this._canNext = false;
        this._canPlay = false;
        this._canPause = false;
        this._canStop = false;
        break;
      }
      case WebPlayerState.Loading:{
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = false;
        this._canPause = false;
        this._canStop = true;
        break;
      }
      case WebPlayerState.Playing: {
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = false;
        this._canPause = true;
        this._canStop = true;
        break;
      }

      case WebPlayerState.Paused:
      {
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = true;
        this._canPause = false;
        this._canStop = true;
        break;
      }
      case WebPlayerState.Stopped:{
        this._canPrevious = true;
        this._canNext = true;
        this._canPlay = true;
        this._canPause = false;
        this._canStop = false;
        break;
      }
    }
  }

  playPause()
  {
    this._webPlayerService.playPause();
  }

  next()
  {
    this._webPlayerService.next();
  }

  previous()
  {
    this._webPlayerService.previous();
  }

  stop()
  {
    this._webPlayerService.stop();
  }

  createPlayer()
  {
    this._webPlayerService.createPlayer("Test Player tha second");
  }

}
