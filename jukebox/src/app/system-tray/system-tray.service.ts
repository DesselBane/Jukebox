import {Injectable} from '@angular/core';
import {ElectronService} from "ngx-electron";

@Injectable()
export class SystemTrayService {

  private readonly _canOperate: boolean = true;
  private _electronService: ElectronService;
  private _dirname: string;
  private _tray: Electron.Tray;
  private _trayMenu: Electron.Menu;
  private _win: Electron.BrowserWindow;

  constructor(electronService: ElectronService) {
    if (!electronService.isElectronApp) {
      this._canOperate = false;
      return;
    }

    this._electronService = electronService;

  }

  public initialize() {
    if (!this._canOperate)
      return;

    this._electronService.ipcRenderer.on('provideDirname', (event, dirname: string) => {
      this._dirname = dirname;
      this.initSysTray();
    });
    this._electronService.ipcRenderer.send('requestDirname');

    this._win = this._electronService.remote.getCurrentWindow();
  }

  private initSysTray() {
    console.log(this._dirname);

    let image = this._electronService.remote.nativeImage.createFromPath(`${this._dirname}/dist/assets/jukebox_24_dark.png`);
    this._tray = new this._electronService.remote.Tray(image);
    let trayMenuTemplate = [
      {
        label: 'Jukebox APP',
        enabled: false
      },
      {
        label: 'Quit Jukebox',
        click: () => {
          this._electronService.ipcRenderer.send('quitApplication');
        }
      }

    ];

    this._trayMenu = this._electronService.remote.Menu.buildFromTemplate(trayMenuTemplate);

    this._tray.setContextMenu(this._trayMenu);
    this._tray.addListener('click', () => {
      this._win.show();
    });
  }

}
