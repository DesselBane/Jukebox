const { app, BrowserWindow } = require('electron');
const Menu = require('electron').Menu;
const appId = '7B0F2E4A-39B3-47EA-82D4-45FB73D4C646';

let win;
let menu = Menu.buildFromTemplate([
  {
    label: 'Reload',
    click: () => {
      console.log("Reloading");
      win.loadURL(`file://${__dirname}/dist/index.html`);
    }
  }
]);

const os = require('os');
let apiProcess = null;
app.setAppUserModelId(appId);

function startApi() {
  const proc = require('child_process').spawn;
  //  run server
  let apiPath = `${__dirname}\\api\\win`;
  let apiFullPath = `${apiPath}\\Jukebox.exe`;
  if (os.platform() === 'darwin') {
    apiPath = `${__dirname}//api//osx`;
    apiFullPath = `${apiPath}//Jukebox`;
  }
  apiProcess = proc(apiFullPath, [], {cwd: apiPath, env: {ASPNETCORE_ENVIRONMENT: 'electron'}});

  apiProcess.stdout.on('data', (data) => {
    writeLog(`stdout: ${data}`);
    if (win == null) {
      createWindow();
    }
  });
}

//Kill process when electron exits
process.on('exit', function () {
  writeLog('exit');
  if (apiProcess != null)
    apiProcess.kill();
});

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

  // Event when the window is closed.
  win.on('closed', function () {
    win = null
  });


}

// Create window on electron intialization
app.on('ready', () => {
  createWindow();
  //startApi();
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

