const {app, BrowserWindow, ipcMain} = require('electron');
const Menu = require('electron').Menu;
const fs = require('fs');
const os = require('os');

const appId = '7B0F2E4A-39B3-47EA-82D4-45FB73D4C646';
const shortcut = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\DarkDevelopment\\Jukebox.lnk';
const shortcutFolder = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\DarkDevelopment';
const executablePath = app.getPath('exe');


let isQuitting = false;
let win;
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


let apiProcess = null;
app.setAppUserModelId(appId);
app.setAsDefaultProtocolClient('jukebox', executablePath);


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
    backgroundColor: '#ffffff',
    show: false
  });


  setTimeout(() => {

    win.loadURL(`file://${__dirname}/dist/index.html`);
  }, 2000);

  win.webContents.on('did-finish-load', () => win.show());

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


function setupWindowsNotifications() {
  if (os.platform() !== 'win32')
    return;

  const {registerAppForNotificationSupport, registerActivator} = require('electron-windows-interactive-notifications');

  if (!fs.existsSync(shortcutFolder))
    fs.mkdirSync(shortcutFolder);
  registerAppForNotificationSupport(shortcut, appId);
  registerActivator();
}
