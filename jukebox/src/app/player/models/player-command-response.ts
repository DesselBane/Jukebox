import {PlayerCommandTypes} from "./player-command-types.enum";

export class PlayerCommandResponse {
  type: PlayerCommandTypes;
  arguments: [string,string][];

  constructor()
  {
    this.arguments = [];
  }
}
