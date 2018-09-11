import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Router} from '@angular/router';
import {AngularMenuItem} from './models/angular-menu-item';
import {MenuItemService} from './menu-item.service';
import {Subject} from 'rxjs';

@Injectable()
export class NavigationService {
  private _menuItemService: MenuItemService;

  constructor(electronService: ElectronService, router: Router, zone: NgZone, menuItemService: MenuItemService) {
    this._electronService = electronService;
    this._router = router;
    this._zone = zone;
    this._menuItemService = menuItemService;

    this.generateAppNavItems().forEach(item => this.registerNavItem(item));
  }

  private _navItemsChanged = new Subject<AngularMenuItem[]>();
  private _electronService: ElectronService;
  private _router: Router;
  private _zone: NgZone;

  get navItemsChanged(): Subject<AngularMenuItem[]> {
    return this._navItemsChanged;
  }

  private _navItemsRepo: AngularMenuItem[] = [];

  get navItemsRepo(): AngularMenuItem[] {
    return this._navItemsRepo;
  }

  public registerNavItem(item: AngularMenuItem): void
  {
    this._navItemsRepo.push(item);
    this._navItemsChanged.next(this._navItemsRepo);

    if(this._electronService.isElectronApp)
    {
      let menu = this._electronService.remote.Menu.getApplicationMenu();

      let menuItem = this._menuItemService.createElectronMenuItem(item);

      menu.append(menuItem);

      this._electronService.remote.Menu.setApplicationMenu(menu);
    }
  }

  public findNavItem(id: string): AngularMenuItem {
    for (let i = 0; i < this._navItemsRepo.length; i++) {
      let result = this.findNavItemInItems(this._navItemsRepo[i], id);
      if (result != null)
        return result;
    }

    return null;
  }

  private findNavItemInItems(item: AngularMenuItem, id: string): AngularMenuItem {
    if (item.id === id)
      return item;

    if (item.submenu == null || item.submenu.length < 1)
      return null;

    for (let i = 0; i < item.submenu.length; i++) {
      let result = this.findNavItemInItems(item.submenu[i], id);
      if (result != null)
        return result;
    }

    return null;
  }


  private generateAppNavItems(): AngularMenuItem[] {
    // Account Items
    let accountItem = new AngularMenuItem({
      label: 'Account',
      id: 'account',
      type: 'submenu',
      submenu: [
        {
          label: 'Login',
          id: 'account/login',
          type: 'normal',
          visible: false,
          click: () => this._zone.run(() => this._router.navigateByUrl('/auth/login'))
        },
        {
          label: 'Register',
          id: 'account/register',
          type: 'normal',
          visible: false,
          click: () => this._zone.run(() => this._router.navigateByUrl('/auth/register'))
        },
        {
          label: 'Logout',
          id: 'account/logout',
          type: 'normal',
          visible: false,
          click: () => this._zone.run(() => this._router.navigateByUrl('/auth/logout'))
        },
        {
          label: 'My Account',
          id: 'account/my_account',
          type: 'normal',
          visible: true,
          click: () => console.log('TODO: create My Account Page')
        }
      ]
    });

    let settingsItem = new AngularMenuItem({
      label: 'Settings',
      id: 'settings',
      type: 'submenu',
      submenu: [
        {
          label: 'General',
          id: 'settings/general',
          type: 'normal',
          click: () => this._zone.run(() => this._router.navigateByUrl('/settings'))
        },
        {
          label: 'TEST',
          id: 'settings/test',
          type: 'normal',
          click: () => console.log('test clicked')
        }
      ]
    });

    let playerItem = new AngularMenuItem({
      label: 'Player',
      id: 'player',
      type: 'submenu',
      submenu: [
        {
          label: 'Browse Music',
          id: 'player/browse_music',
          type: 'normal',
          click: () => this._zone.run(() => this._router.navigateByUrl('/home'))
        },
        {
          label: 'Select Player',
          id: 'player/select_player',
          type: 'normal',
          click: () => this._zone.run(() => this._router.navigateByUrl('/player/select'))
        },
        {
          label: 'Active Player',
          id: 'player/active_player',
          type: 'normal',
          click: () => this._zone.run(() => this._router.navigateByUrl('/player/web'))
        }
      ]
    });

    return [accountItem, playerItem, settingsItem];
  }

}
