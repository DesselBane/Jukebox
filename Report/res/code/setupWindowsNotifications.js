function setupWindowsNotifications() {
  if (os.platform() !== 'win32')
    return;

  const {registerAppForNotificationSupport, registerActivator} = require('electron-windows-interactive-notifications');

  if (!fs.existsSync(shortcutFolder)) |\label{line:swn_fs}|
    fs.mkdirSync(shortcutFolder);
  registerAppForNotificationSupport(shortcut, appId);
  registerActivator();
}
