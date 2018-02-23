import { Injectable } from '@angular/core';
import {NavItem} from "./models/nav-item";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class NavigationService {
  get navItems(): Observable<NavItem[]> {
    return this._navItemsSubject.asObservable();
  }

  get currentNavItems() : NavItem[] {
    return this._navItemsRepo;
  }

  constructor() {
    this._navItemsRepo = [new NavItem("Test", "",[
      new NavItem("Sub Item")
    ])];
    this._navItemsSubject = new Subject<NavItem[]>();
  }

  private _navItemsRepo: NavItem[];
  private _navItemsSubject: Subject<NavItem[]>;

  public registerNavItem(item: NavItem) : void
  {
    this._navItemsRepo.push(item);
    this._navItemsSubject.next(this._navItemsRepo);
  }

}
