import {Injectable} from '@angular/core';
import {NotificationChannels} from './models/notification-channels.enum';
import {Observable, Observer, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {NotificationResponse} from './models/notification-response';
import {environment} from '../../environments/environment';
import {ElectronService} from 'ngx-electron';
import {UserNotificationOptions} from './models/user-notification-options';
import {HostEnvironment} from '../shared/models/host-environment.enum';

declare var Notification: any;

@Injectable()
export class NotificationService {
  private _electronService: ElectronService;
  private _hostEnvironment: HostEnvironment;

  constructor(electronService: ElectronService) {

    this._electronService = electronService;

    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      this._canSendNotifications = false;
    }
    else if (Notification.permission === "default")
      Notification.requestPermission()
        .then(() => this._canSendNotifications = Notification.permission === "granted");

    if (!this._electronService.isElectronApp)
      this._hostEnvironment = HostEnvironment.Web;
    else {
      switch (this._electronService.remote.process.platform) {
        case 'darwin':
          this._hostEnvironment = HostEnvironment.OSX;
          break;
        case 'linux':
          this._hostEnvironment = HostEnvironment.Linux;
          break;
        case 'win32':
          this._hostEnvironment = HostEnvironment.Windows;
          break;
        default:
          this._hostEnvironment = HostEnvironment.Web;
          break;
      }
    }

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
      .pipe(
        filter((notification: NotificationResponse) => {
          return notification.Channel == channel;
        })
      )
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
        this._otherSubject.next(JSON.parse(messageEvent.data))
      }
      , err => NotificationService.handleSocketError(err)
      , () => this.handleSocketCompleted());
  }

  private handleSocketCompleted() {
    console.log("Completed");
    this._notificationSocket = null;
  }

  private static displayHTMLNotification(notificationOptions: UserNotificationOptions) {
    new Notification(notificationOptions.title, {
      body: notificationOptions.body,
      icon: notificationOptions.icon,
      appId: environment.appId
    });
  }

  public displayUserNotification(notificationOptions: UserNotificationOptions) {
    if (!this.canSendNotifications)
      return;

    NotificationService.displayHTMLNotification(notificationOptions);

  }

}
