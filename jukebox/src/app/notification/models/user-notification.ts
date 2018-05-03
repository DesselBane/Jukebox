import {UserNotificationTemplate} from "./user-notification-template";

export class UserNotification implements UserNotificationTemplate {
  actions: string[];
  body: string;
  icon: string;
  title: string;

}
