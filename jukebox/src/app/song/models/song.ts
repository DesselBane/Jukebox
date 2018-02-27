export class Song {

  public title: string;
  public artist: string;
  public album: string;
  public url: string;

  constructor(title: string, artist?: string, album?: string)
  {
    this.title = title;
    this.artist = artist;
    this.album = album;
  }
}