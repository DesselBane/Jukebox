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
  constructor() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      this._canSendNotifications = false;
    }
    else if (Notification.permission === "default")
      Notification.requestPermission()
        .then(() => this._canSendNotifications = Notification.permission === "granted");

    this.openNotificationSocket();
  }

  private _notificationSocket: WebSocket;
  private _subject: Subject<MessageEvent>;
  private _otherSubject = new Subject<NotificationResponse>();

  // noinspection TypeScriptFieldCanBeMadeReadonly
  private _canSendNotifications = true;

  get canSendNotifications(): boolean {
    return this._canSendNotifications;
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

  public displayUserNotification(notification: UserNotification) {
    if (!this.canSendNotifications)
      return;

    new Notification("Hi there!", {
      badge: "https://i.imgur.com/4reaNuF.jpg",
      body: "This is the Notification Body",
      image: "https://i.imgur.com/AkDc38Z.jpg",
      icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJPSURBVGhD7do5ixRBGIfx8QYRDERQWPAIzQQRBAURv4LgCoLifSsiiIGBkZmIibBgZiAaKpgIot9AEBMxMRINDNREPJ7/sK80RU3121d1g/3CL5iarmaenZmlZ3Yn44zzf806bF20Sgt9zzye4SZWaMEx1/EbfxZ9xnb0NldgD0YewxPzDcV9soBe5jLCByOemNi+h8g+syJMWUxsT/YQRRRf3/IjuC2pmPBYyRpyCWHEO2zCk8KamRUTHifZQmZFbIRmJbwx4TGSJeQiUhE23pjwfuk85AJSEUtwDmumt9Ixy6EJ75NOQzwRd6D1V/DGhOvSWch5eCOMNyZck05C9FKpGmE8MTGthzSJMHViWg05i6YRpmpMayFn0FaEqRLTSkgXEcYb0zjkNLqKMJ6Yl1iKWnMKXUcYT8wDVI7JGWFajzmJ3BGmtZgT6CvCNI4ZQoSpHXMcQ4kwxRhd5pfG7MIvFA/oO8J4Ym5gOuGXBUOJMGUxLzCdzfgELb7BkCJMGPMIWtfb4Rj+zVrshN5YmroRb3EUBxIO4Sli+1OKMXp8e7FjemvGNHkm9Ox6Rj/VD4idI6UYk5wmEV9RZeo8K+KK0W+w2GaPXCFyDcnZjdhGj5wh+sY+OWMIxpAaxhCPMaSGMcRjUCG6cIxt9NBfY6vMc8TO43EVyZlDbKOXrkg9sx5fEDuHx0GUjj5YxTZ7fIc+ft5OuIePiO33+IkNKJ3DiJ1gKO7DPXcRO0nfXmM1Ks0RvEfshLnp/XQLjf7BZgv2YH8P9mEbliExk8lfN8HbebLAzesAAAAASUVORK5CYII=",
      data: {lol: "this is some data"}
    });

  }
}
