import {Injectable} from '@angular/core';
import {NotificationChannels} from "./models/notification-channels.enum";
import {Observable} from "rxjs/Observable";
import {NotificationResponse} from "./models/notification-response";
import {Observer} from "rxjs/Observer";
import {environment} from "../../environments/environment";
import {Subject} from "rxjs/Subject";
import {ElectronService} from "ngx-electron";
import {UserNotificationTemplate} from "./models/user-notification-template";
import {HostEnvironment} from "../shared/models/host-environment.enum";

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

  public displayUserNotification(notificationTemplate: UserNotificationTemplate) {
    if (!this.canSendNotifications)
      return;

    this.generateWindowsNotification({
      title: "Notification Title",
      body: "This is the Notification Body",
      icon: "http://localhost:5000/assets/jukebox_48_dark.png",
      actions: ['Previous', 'Next']
    });

    return;

    /*  let basicNot = new Notification("Hi there!", {
        badge: "https://i.imgur.com/4reaNuF.jpg",
        body: "This is the Notification Body",
        image: "https://i.imgur.com/AkDc38Z.jpg",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJPSURBVGhD7do5ixRBGIfx8QYRDERQWPAIzQQRBAURv4LgCoLifSsiiIGBkZmIibBgZiAaKpgIot9AEBMxMRINDNREPJ7/sK80RU3121d1g/3CL5iarmaenZmlZ3Yn44zzf806bF20Sgt9zzye4SZWaMEx1/EbfxZ9xnb0NldgD0YewxPzDcV9soBe5jLCByOemNi+h8g+syJMWUxsT/YQRRRf3/IjuC2pmPBYyRpyCWHEO2zCk8KamRUTHifZQmZFbIRmJbwx4TGSJeQiUhE23pjwfuk85AJSEUtwDmumt9Ixy6EJ75NOQzwRd6D1V/DGhOvSWch5eCOMNyZck05C9FKpGmE8MTGthzSJMHViWg05i6YRpmpMayFn0FaEqRLTSkgXEcYb0zjkNLqKMJ6Yl1iKWnMKXUcYT8wDVI7JGWFajzmJ3BGmtZgT6CvCNI4ZQoSpHXMcQ4kwxRhd5pfG7MIvFA/oO8J4Ym5gOuGXBUOJMGUxLzCdzfgELb7BkCJMGPMIWtfb4Rj+zVrshN5YmroRb3EUBxIO4Sli+1OKMXp8e7FjemvGNHkm9Ox6Rj/VD4idI6UYk5wmEV9RZeo8K+KK0W+w2GaPXCFyDcnZjdhGj5wh+sY+OWMIxpAaxhCPMaSGMcRjUCG6cIxt9NBfY6vMc8TO43EVyZlDbKOXrkg9sx5fEDuHx0GUjj5YxTZ7fIc+ft5OuIePiO33+IkNKJ3DiJ1gKO7DPXcRO0nfXmM1Ks0RvEfshLnp/XQLjf7BZgv2YH8P9mEbliExk8lfN8HbebLAzesAAAAASUVORK5CYII=",
        data: {lol: "this is some data"},
        appId: environment.appId
      });

      basicNot.onclick = (event) => console.log(event);*/


  }

  private generateWindowsNotification(notificationTemplate: UserNotificationTemplate) {
    let notifications = this._electronService.remote.require('electron-windows-notifications');

    let template = `<toast>
                        <visual><binding template="ToastGeneric">
                            <text id="1">${notificationTemplate.title}</text><text id="2">${notificationTemplate.body}</text>
                            <text placement="attribution">Via Electron :D</text>
                            <image placement="appLogoOverride" hint-crop="circle" src="ms-appx:///app/resources/app/dist/assets/jukebox_48_dark.png" />
                        </binding></visual>
                        <actions>
                            <action content='${notificationTemplate.actions[0]}' arguments='action=${notificationTemplate.actions[0]}' activationType='foreground'  />
                            <action content='${notificationTemplate.actions[1]}' arguments='action=${notificationTemplate.actions[1]}' activationType='foreground' />
                        </actions>
                    </toast>`;

    let winNot = new notifications.ToastNotification({
      appId: environment.appId,
      template: template,
    });

    console.log(template);

    winNot.on('activated', (e, t) => {
      console.log('Activated!');
      console.log(e);
      console.log(t);
    });
    winNot.on('dismissed', (e, t) => {
      console.log('Dismissed!');
      console.log(e);
      console.log(t);
    });
    winNot.show();
  }


}
