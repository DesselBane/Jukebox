export class AudioPlayer {
  get name(): string {
    return this._name;
  }
  get playerId(): string {
    return this._playerId;
  }
  private _playerId : string;
  private _name: string;

  constructor(playerId: string, name: string)
  {
    this._playerId = playerId;
    this._name = name;
  }
}
