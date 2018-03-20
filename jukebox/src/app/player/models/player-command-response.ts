import {PlayerCommandTypes} from "./player-command-types.enum";

export class PlayerCommandResponse {
  Type: PlayerCommandTypes;
  Arguments: [string,string][];

  constructor()
  {
    this.Arguments = [];
  }
}
