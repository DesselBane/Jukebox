private static displayHTMLNotification(notificationOptions: UserNotificationOptions) {
  new Notification(notificationOptions.title, {
    body: notificationOptions.body,
    icon: notificationOptions.icon,
    appId: environment.appId
  });
}
