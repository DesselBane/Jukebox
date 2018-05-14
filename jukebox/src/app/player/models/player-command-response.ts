import {PlayerCommandTypes} from "./player-command-types.enum";

export class PlayerCommandResponse {
  Type: PlayerCommandTypes;
  Arguments: [string,string][];

  constructor(type: PlayerCommandTypes, args?: [string, string][]) {
    this.Type = type;
    this.Arguments = args || [];
  }
}
