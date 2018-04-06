import {Column, Model, PrimaryKey, Table} from "sequelize-typescript";
import {ArtistResponse} from "./artist-response";

@Table
export class ArtistEntity extends Model<ArtistEntity> implements ArtistResponse {
  @PrimaryKey
  @Column
  id: number;

  @Column
  name: string;

}
