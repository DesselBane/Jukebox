import {UserNotificationOptions} from "./user-notification-options";

export class UserNotification implements UserNotificationOptions {
  private _actions: string[];

  get actions(): string[] {
    return this._actions;
  }

  private _body: string;

  get body(): string {
    return this._body;
  }

  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  private _title: string;

  get title(): string {
    return this._title;
  }

}
