const {app, BrowserWindow, ipcMain} = require('electron');
const Menu = require('electron').Menu;
const appId = '7B0F2E4A-39B3-47EA-82D4-45FB73D4C646';
const shortcut = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\DarkDevelopment\\Jukebox.lnk';
const shortcutFolder = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\DarkDevelopment';
const {registerAppForNotificationSupport, registerActivator} = require('electron-windows-interactive-notifications');
const fs = require('fs');

let win;
let menu = Menu.buildFromTemplate([
  {
    label: 'Development',
    submenu: [
      {
        label: 'Reload',
        click: () => {
          console.log("Reloading");
          win.loadURL(`file://${__dirname}/dist/index.html`);
        }
      }
    ]
  }
]);
let isQuitting = false;

const os = require('os');
let apiProcess = null;
app.setAppUserModelId(appId);

ipcMain.on('requestDirname', () => {
  win.webContents.send('provideDirname', __dirname);
});
ipcMain.on('quitApplication', () => {
  isQuitting = true;
  win.close();
});


//Kill process when electron exits
process.on('exit', function () {
  writeLog('exit');
  if (apiProcess != null)
    apiProcess.kill();
});

function startApi() {
  const proc = require('child_process').spawn;
  //  run server
  let apiPath = `${__dirname}\\api\\win`;
  let apiFullPath = `${apiPath}\\Jukebox.exe`;

  if (os.platform() === 'darwin') {
    apiPath = `${__dirname}//api//osx`;
    apiFullPath = `${apiPath}//Jukebox`;
  }
  if (os.platform() === 'linux') {
    apiPath = `${__dirname}/api/linux`;
    apiFullPath = `${apiPath}/Jukebox`;
  }

  apiProcess = proc(apiFullPath, [], {cwd: apiPath, env: {ASPNETCORE_ENVIRONMENT: 'electron'}});

  apiProcess.stdout.on('data', (data) => {
    writeLog(`stdout: ${data}`);
    if (win == null) {
      createWindow();
    }
  });
}

function writeLog(msg) {
  console.log(msg);
}

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1600,
    height: 800,
    backgroundColor: '#ffffff'
  });

  win.loadURL(`file://${__dirname}/dist/index.html`);

  //// uncomment below to open the DevTools.
   win.webContents.openDevTools();

  win.on('close', (event) => {

    if (!isQuitting) {
      event.preventDefault();
      win.hide();
    }
    else {
      win = null;
      app.quit();
    }
  });
}

// Create window on electron intialization
app.on('ready', () => {

  setupWindowsNotifications();
  createWindow();
  startApi();
  Menu.setApplicationMenu(menu);
});

function setupWindowsNotifications() {
  if (os.platform() !== 'win32')
    return;

  if (!fs.existsSync(shortcutFolder))
    fs.mkdirSync(shortcutFolder);
  registerAppForNotificationSupport(shortcut, appId);
  registerActivator();
}
