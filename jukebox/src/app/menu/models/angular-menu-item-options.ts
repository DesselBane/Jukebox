export interface AngularMenuItemOptions {
  click?: Function;
  type?: ('normal' | 'separator' | 'submenu')
  label?: string;
  accelerator?: string;
  icon?: string;
  enabled?: boolean;
  visible?: boolean;
  submenu?: AngularMenuItemOptions[];
  id?: string;
  position?: string;
}
