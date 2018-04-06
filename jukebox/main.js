const { app, BrowserWindow } = require('electron');
const Menu = require('electron').Menu;

let win;
let menu = Menu.buildFromTemplate([]);

const os = require('os');
let apiProcess = null;

function startApi() {
  const proc = require('child_process').spawn;
  //  run server
  let apiPath = `${__dirname}\\api\\bin\\dist\\win`;
  let apiFullPath = `${apiPath}\\Jukebox.exe`;
  if (os.platform() === 'darwin') {
    apiPath = `${__dirname}//api//bin//dist//osx`;
    apiFullPath = `${apiPath}//Jukebox`;
  }
  apiProcess = proc(apiFullPath, [], {cwd: apiPath});

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
  startApi();
  Menu.setApplicationMenu(menu);
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

