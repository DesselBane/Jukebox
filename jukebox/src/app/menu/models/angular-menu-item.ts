import {Subject} from "rxjs/Subject";
import {Subscription} from "rxjs/Subscription";
import {AngularMenuItemOptions} from "./angular-menu-item-options";

export class AngularMenuItem implements AngularMenuItemOptions {

  constructor(options: AngularMenuItemOptions) {
    this._click = options.click;
    this._type = options.type;
    this._label = options.label;
    this._accelerator = options.accelerator;
    this._icon = options.icon;
    this._enabled = options.enabled || true;
    this._visible = options.visible || true;
    this._id = options.id;
    this._position = options.position;

    if (options.submenu != null)
      options.submenu.forEach(subOptions => this._submenu.push(new AngularMenuItem(subOptions)));
  }

  private _click: Function;

  get click(): Function {
    return this._click;
  }

  private _type: ('normal' | 'separator' | 'submenu');

  get type() {
    return this._type;
  }

  private _label: string;

  get label(): string {
    return this._label;
  }

  private _accelerator: string;

  get accelerator(): string {
    return this._accelerator;
  }

  private _icon: string;

  get icon(): string {
    return this._icon;
  }

  private _enabled: boolean;

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.enabledChanged.next();
  }

  private _visible: boolean;

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
    this.visibleChanged.next();
  }

  private _submenu: AngularMenuItem[] = [];

  get submenu(): AngularMenuItem[] {
    return this._submenu;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  private _position: string;

  get position(): string {
    return this._position;
  }

  private _enabledChanged = new Subject();

  get enabledChanged(): Subject<any> {
    return this._enabledChanged;
  }

  private _visibleChanged = new Subject();

  get visibleChanged(): Subject<any> {
    return this._visibleChanged;
  }

  private _subscriptions: Subscription[] = [];

  get subscriptions(): Subscription[] {
    return this._subscriptions;
  }

  public clone(options: AngularMenuItemOptions): AngularMenuItem {
    let newOptions: AngularMenuItemOptions = this;

    if (options.click != null)
      newOptions.click = options.click;
    if (options.type != null)
      newOptions.type = options.type;
    if (options.label != null)
      newOptions.label = options.label;
    if (options.accelerator != null)
      newOptions.accelerator = options.accelerator;
    if (options.icon != null)
      newOptions.icon = options.icon;
    if (options.enabled != null)
      newOptions.enabled = options.enabled;
    if (options.visible != null)
      newOptions.visible = options.visible;
    if (options.id != null)
      newOptions.id = options.id;
    if (options.position != null)
      newOptions.position = options.position;

    return new AngularMenuItem(newOptions);
  }

}
