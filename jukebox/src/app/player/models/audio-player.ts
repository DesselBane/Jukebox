import {Song} from "./song";

export class AudioPlayer {
  set currentSong(value: Song) {
    this._currentSong = value;
  }
  set isPlaying(value: boolean) {
    this._isPlaying = value;
  }
  get currentSong(): Song {
    return this._currentSong;
  }
  get isPlaying(): boolean {
    return this._isPlaying;
  }
  get name(): string {
    return this._name;
  }
  get playerId(): string {
    return this._playerId;
  }
  private _playerId : string;
  private _name: string;

  private _isPlaying: boolean;
  private _currentSong: Song;

  constructor(playerId: string, name: string)
  {
    this._playerId = playerId;
    this._name = name;
  }
}
