import {NotificationChannels} from "./notification-channels.enum";

export class NotificationResponse {
  Channel: NotificationChannels;
  Arguments: [string, string][];

  constructor() {
    this.Arguments = [];
  }
}
