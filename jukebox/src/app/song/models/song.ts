export class Song {

  public title: string;
  public artist: string;
  public album: string;
  public id: number;

  constructor(id: number,title: string, artist?: string, album?: string)
  {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.album = album;
  }
}
