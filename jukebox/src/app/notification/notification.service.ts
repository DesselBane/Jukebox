import {Injectable} from '@angular/core';
import {NotificationChannels} from "./models/notification-channels.enum";
import {Observable} from "rxjs/Observable";
import {NotificationResponse} from "./models/notification-response";
import {Observer} from "rxjs/Observer";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs/Subject";

@Injectable()
export class NotificationService {
  private _notificationSocket: WebSocket;
  private _subject: Subject<MessageEvent>;

  constructor() {
    this.openNotificationSocket();
  }

  private static handleSocketError(error) {
    console.log(error);
  }

  subscribeToChannel(channel: NotificationChannels): Observable<NotificationResponse> {
    return this._subject.asObservable()
      .map((messageEvent: MessageEvent) => {
        return JSON.parse(messageEvent.data);
      })
      .filter((notification: NotificationResponse) => {
        return notification.Channel == channel;
      });
  }

  private openNotificationSocket() {
    this._notificationSocket = new WebSocket(`${environment.websocketBaseUrl}/api/notification/ws`);

    let observable = Observable.create((obs: Observer<MessageEvent>) => {
      this._notificationSocket.onmessage = obs.next.bind(obs);
      this._notificationSocket.onerror = obs.error.bind(obs);
      this._notificationSocket.onclose = obs.complete.bind(obs);
      return this._notificationSocket.close.bind(this._notificationSocket);
    });

    let observer = {
      next: () => {
      }
    };

    this._subject = Subject.create(observer, observable);

    this._subject.subscribe(() => {
      }
      , err => NotificationService.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  private handleSocketCompleted() {
    console.log("Completed");
    this._notificationSocket = null;
  }
}
