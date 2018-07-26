const isSecondInstance = app.makeSingleInstance((argv) => {
  if (win == null)
    return;
  win.webContents.send('protocolActivation', argv[1]);
  console.log(argv[1]);
});

if (isSecondInstance) {
  setTimeout(() => {
    isQuitting = true;
    app.quit();
  }, 1000)
} else {
  // Create window on electron intialization
  app.on('ready', () => {
    Menu.setApplicationMenu(menu);
    setupWindowsNotifications();
    startApi();
    createWindow();
    console.log(isSecondInstance);
  });
}
