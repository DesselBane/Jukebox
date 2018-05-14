import {Injectable} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {AngularMenuItem} from "./models/angular-menu-item";
import {MenuItemService} from "./menu-item.service";

@Injectable()
export class SystemTrayService {

  private readonly _canOperate: boolean = true;
  private _electronService: ElectronService;
  private _dirname: string;
  private _tray: Electron.Tray;
  private _trayMenu: Electron.Menu;
  private _win: Electron.BrowserWindow;
  private _menuItemService: MenuItemService;

  constructor(electronService: ElectronService, menuItemService: MenuItemService) {
    this._menuItemService = menuItemService;

    if (!electronService.isElectronApp) {
      this._canOperate = false;
      return;
    }

    this._electronService = electronService;
    this.initialize();
  }

  public updateTooltip(newTooltip: string) {
    if (!this._canOperate)
      return;

    this._tray.setToolTip(newTooltip);
  }

  public addTrayMenuItem(menuItem: AngularMenuItem) {
    if (!this._canOperate)
      return;

    let eMenuItem = this._menuItemService.createElectronMenuItem(menuItem);
    this._trayMenu.append(eMenuItem);
  }

  private initialize() {
    if (!this._canOperate)
      return;

    let app = this._electronService.remote.require('electron').app;
    this._dirname = app.getAppPath();

    this._win = this._electronService.remote.getCurrentWindow();

    let image = this._electronService.remote.nativeImage.createFromPath(`${this._dirname}/dist/assets/jukebox_24_dark.png`);
    this._tray = new this._electronService.remote.Tray(image);

    let trayMenuTemplate = [
      {
        label: 'Jukebox APP',
        id: 'app',
        click: () => this._win.show(),
        position: 'first'
      },
      {
        label: 'Quit Jukebox',
        click: () => {
          this._electronService.ipcRenderer.send('quitApplication');
        },
        position: 'last',
        id: 'quit'
      }

    ];

    this._trayMenu = this._electronService.remote.Menu.buildFromTemplate(trayMenuTemplate);

    this._tray.setContextMenu(this._trayMenu);
    this._tray.addListener('click', () => {
      this._win.show();
    });
  }

}
