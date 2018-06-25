import {Injectable} from '@angular/core';
import {ElectronService} from "ngx-electron";
import {AngularMenuItem} from "./models/angular-menu-item";

@Injectable()
export class MenuItemService {
  private _electronService: ElectronService;

  constructor(electronService: ElectronService) { |\label{line:service_cons}|
    this._electronService = electronService;
  }

  public createElectronMenuItem(menuItem: AngularMenuItem)
    : Electron.MenuItem
  { [...] }

}
