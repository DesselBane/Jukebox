import { Injectable } from '@angular/core';
import {NavItem} from "./models/nav-item";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {ElectronService} from "ngx-electron";
import {Router} from "@angular/router";

@Injectable()
export class NavigationService {
  private _electronService: ElectronService;
  private _router: Router;


  get navItems(): Observable<NavItem[]> {
    return this._navItemsSubject.asObservable();
  }

  get currentNavItems() : NavItem[] {
    return this._navItemsRepo;
  }

  constructor(electronService: ElectronService, router: Router) {
    this._electronService = electronService;
    this._router = router;

    this._navItemsRepo = [];
    this._navItemsSubject = new Subject<NavItem[]>();
  }

  private _navItemsRepo: NavItem[];
  private _navItemsSubject: Subject<NavItem[]>;

  public registerNavItem(item: NavItem) : void
  {
    console.log("Item registered");
    console.log(item);

    this._navItemsRepo.push(item);
    this._navItemsSubject.next(this._navItemsRepo);

    if(this._electronService.isElectronApp)
    {
      let that = this;

      this._electronService.ipcRenderer.send('updateMenu', {
        label: item.name,
        route: item.route,
      });
    }
  }

}
