import {Injectable, NgZone} from '@angular/core';
import {NavItem} from "./models/nav-item";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ElectronService} from "ngx-electron";
import {Router} from "@angular/router";

@Injectable()
export class NavigationService {
  private _electronService: ElectronService;
  private _router: Router;
  private _zone: NgZone;
  private _trayIcon: Electron.Tray;
  private _trayMenu: Electron.Menu;



  get navItems(): Observable<NavItem[]> {
    return this._navItemsSubject.asObservable();
  }

  get currentNavItems() : NavItem[] {
    return this._navItemsRepo;
  }

  constructor(electronService: ElectronService, router: Router, zone: NgZone) {
    this._electronService = electronService;
    this._router = router;
    this._zone = zone;

    this._navItemsRepo = [];
    this._navItemsSubject = new Subject<NavItem[]>();
    this.createSysTrayIcon();

  }

  private _navItemsRepo: NavItem[];
  private _navItemsSubject: Subject<NavItem[]>;

  public registerNavItem(item: NavItem) : void
  {
    this._navItemsRepo.push(item);
    this._navItemsSubject.next(this._navItemsRepo);


    if(this._electronService.isElectronApp)
    {
      let menu = this._electronService.remote.Menu.getApplicationMenu();

      let menuItem = this.createElectronMenuItem(item);
      menu.append(menuItem);

      this._electronService.remote.Menu.setApplicationMenu(menu);
    }
  }

  private createElectronMenuItem(navItem: NavItem) : any
  {
    let subItems = [];

    navItem.subItems.forEach(value => {
        subItems.push(this.createElectronMenuItem(value));
    });

    let item = new this._electronService.remote.MenuItem({
      label: navItem.name,
      click: () => this._zone.run(() => this._router.navigate([navItem.route])),
      submenu: subItems.length > 0 ? subItems : null,
      type: subItems.length > 0 ? "submenu" : "normal",
      enabled: navItem.isVisible,
      id: navItem.id
    });

    navItem.isVisibleChanged.subscribe(() => {
      let menuItem = this._electronService.remote.Menu.getApplicationMenu().getMenuItemById(navItem.id);
      if(menuItem != null)
        menuItem.visible = navItem.isVisible;
    });

    return item;
  }

  public updateSysTrayToolTip(toolTip: string) {
    this._trayIcon.setToolTip(toolTip);
  }

  private createSysTrayIcon() {
    if (!this._electronService.isElectronApp)
      return;


    this._trayIcon = new this._electronService.remote.Tray(`dist/assets/jukebox_24_dark.png`);
    let trayMenuTemplate = [{
      label: 'Jukebox APP',
      enabled: false
    }];

    this._trayMenu = this._electronService.remote.Menu.buildFromTemplate(trayMenuTemplate);

    this._trayIcon.setContextMenu(this._trayMenu);
  }

}
