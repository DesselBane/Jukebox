import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  audio;

  constructor()
  {
    this.audio = new Audio();

  }

  play(): void
  {
    this.audio.src = "/api/song/next";

    this.audio.load();
    this.audio.play();
  }

  stop() : void{
    this.audio.pause();
    this.audio.currentTime = 0;
  }
}
