import {EventEmitter} from "@angular/core";

export class NavItem {
  get id(): string {
    return this._id;
  }
  get isVisibleChanged(): EventEmitter<any> {
    return this._isVisibleChanged;
  }
  get isVisible(): boolean
  {
    return this._isVisible != null ? this._isVisible : true;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
    this._isVisibleChanged.emit();
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
  private _isVisibleChanged = new EventEmitter();
  private _id: string;

  constructor(id: string,name: string,route?: string, subItems?: NavItem[], isVisible?: boolean)
  {
    this._name = name;
    this._route = route;
    this._subItems = subItems || [];
    this._isVisible = isVisible;

    if(this._isVisible == null)
      this._isVisible = true;

    this._id = id;
  }
}
