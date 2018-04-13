import {Injectable} from '@angular/core';
import {NotificationChannels} from "./models/notification-channels.enum";
import {Observable} from "rxjs/Observable";
import {NotificationResponse} from "./models/notification-response";
import {Observer} from "rxjs/Observer";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs/Subject";
import {UserNotification} from "./models/user-notification";

declare var Notification: any;

@Injectable()
export class NotificationService {
  private _notificationSocket: WebSocket;
  private _subject: Subject<MessageEvent>;
  private _otherSubject = new Subject<NotificationResponse>();

  constructor() {
    this.openNotificationSocket();
  }

  private static handleSocketError(error) {
    console.log(error);
  }

  subscribeToChannel(channel: NotificationChannels): Observable<NotificationResponse> {
    return this._otherSubject.asObservable()

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

    this._subject.subscribe((messageEvent: MessageEvent) => {
        console.log(messageEvent);
        this._otherSubject.next(JSON.parse(messageEvent.data))
      }
      , err => NotificationService.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  private handleSocketCompleted() {
    console.log("Completed");
    this._notificationSocket = null;
  }

  public displayUserNotification(notifica: UserNotification) {
    console.log(Notification.permission);

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      let notification = new Notification("Hi there!");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          let notification = new Notification("Hi there!");
        }
      });
    }
  }
}
