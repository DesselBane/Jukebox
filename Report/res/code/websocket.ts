private openNotificationSocket() {
  this._notificationSocket = new WebSocket(`${environment.websocketBaseUrl}/api/notification/ws`);

  let observable = Observable.create((obs: Observer<MessageEvent>) => { |\label{line:websocket_observable_start}|
    this._notificationSocket.onmessage = obs.next.bind(obs);
    this._notificationSocket.onerror = obs.error.bind(obs);
    this._notificationSocket.onclose = obs.complete.bind(obs);
    return this._notificationSocket.close.bind(this._notificationSocket); |\label{line:websocket_observable_stop}|
  });

  let observer = { next: () => { } }; |\label{line:websocket_observer}|

  this._subject = Subject.create(observer, observable);

  this._subject.subscribe((messageEvent: MessageEvent) => {
      this._otherSubject.next(JSON.parse(messageEvent.data))
    }
    , err => NotificationService.handleSocketError(err)
    , () => this.handleSocketCompleted());
}
