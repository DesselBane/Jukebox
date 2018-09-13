import {Injectable, NgZone} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {AngularNavItem} from './models/angular-nav-item';

@Injectable()
export class NavigationService {

  constructor(electronService: ElectronService, router: Router, zone: NgZone) {
    this._electronService = electronService;
    this._router = router;
    this._zone = zone;

    NavigationService.generateAppNavItems().forEach(item => this.registerNavItem(item));
  }

  private _navItemsChanged = new Subject<AngularNavItem[]>();
  private _electronService: ElectronService;
  private _router: Router;
  private _zone: NgZone;

  get navItemsChanged(): Subject<AngularNavItem[]> {
    return this._navItemsChanged;
  }

  private _navItemsRepo: AngularNavItem[] = [];

  get navItemsRepo(): AngularNavItem[] {
    return this._navItemsRepo;
  }

  private static generateAppNavItems(): AngularNavItem[] {
    // Account Items
    let accountItem = new AngularNavItem({
      label: 'Account',
      id: 'account',
      type: 'normal',
      location: 'auth/account',
      icon: 'account_circle'
    });

    let settingsItem = new AngularNavItem({
      label: 'Settings',
      id: 'settings',
      type: 'normal',
      location: 'settings',
      icon: 'settings'
    });

    let browseMusicItem = new AngularNavItem({
      label: 'Music',
      id: 'music',
      type: 'normal',
      location: '/home',
      icon: 'library_music'
    });

    let selectPlayerItem = new AngularNavItem({
      label: 'Select Player',
      id: 'selectPlayer',
      type: 'normal',
      location: 'player/select',
      icon: 'radio'
    });


    return [browseMusicItem, selectPlayerItem, accountItem, settingsItem];
  }

  public registerNavItem(item: AngularNavItem): void {
    this._navItemsRepo.push(item);
    this._navItemsChanged.next(this._navItemsRepo);
  }

}
