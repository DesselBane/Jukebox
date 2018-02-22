import {Observable} from "rxjs/Observable";

export class NavItem {
  get isVisible(): Observable<boolean> {
    return this._isVisible;
  }
  get canActivate(): Observable<boolean> {
    return this._canActivate;
  }
  get navItems(): [NavItem] {
    return this._navItems;
  }
  get route(): string {
    return this._route;
  }
  get name(): string {
    return this._name;
  }
  private _name: string;
  private _route: string;
  private _navItems: [NavItem];
  private _canActivate: Observable<boolean>;
  private _isVisible: Observable<boolean>;

  constructor(name: string,route: string)
  {
    this._name = name;
    this._route = route;
  }
}
