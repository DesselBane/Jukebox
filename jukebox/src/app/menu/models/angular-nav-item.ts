import {AngularNavItemOptions} from './angular-nav-item-options';

export class AngularNavItem implements AngularNavItemOptions {
  private readonly _location: string;
  private readonly _type: ('normal' | 'separator');
  private readonly _label: string;
  private readonly _icon: string;
  private readonly _id: string;
  private readonly _position: string;

  constructor(options: AngularNavItemOptions) {
    this._location = options.location;
    this._type = options.type;
    this._label = options.label;
    this._icon = options.icon;
    this._enabled = options.enabled || true;
    this._visible = options.visible || true;
    this._id = options.id;
    this._position = options.position;
  }

  get location(): string {
    return this._location;
  }

  get type() {
    return this._type;
  }

  get label(): string {
    return this._label;
  }

  get icon(): string {
    return this._icon;
  }

  private _enabled: boolean;

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
  }

  private _visible: boolean;

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  get id(): string {
    return this._id;
  }

  get position(): string {
    return this._position;
  }

  public clone(options: AngularNavItemOptions): AngularNavItem {
    let newOptions: AngularNavItemOptions = this;

    if (options.location != null)
      newOptions.location = options.location;
    if (options.type != null)
      newOptions.type = options.type;
    if (options.label != null)
      newOptions.label = options.label;
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

    return new AngularNavItem(newOptions);
  }


}
