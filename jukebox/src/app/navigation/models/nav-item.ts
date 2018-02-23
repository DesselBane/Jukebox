import {Observable} from "rxjs/Observable";

export class NavItem {
  get isVisible(): boolean {
    return this._isVisible == null ? true : this._isVisible;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
  }

  get subItems(): NavItem[] {
    return this._subItems;
  }
  get route(): string {
    return this._route;
  }
  get name(): string {
    return this._name;
  }
  private _name: string;
  private _route: string;
  private _subItems: NavItem[];
  private _isVisible: boolean;

  constructor(name: string,route?: string, subItems?: NavItem[], isVisible?: boolean)
  {
    this._name = name;
    this._route = route;
    this._subItems = subItems || [];
    this._isVisible = isVisible;
  }
}
