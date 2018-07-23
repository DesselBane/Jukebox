app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  setupWindowsNotifications();
  startApi();
  createWindow();
  console.log(isSecondInstance);
});
