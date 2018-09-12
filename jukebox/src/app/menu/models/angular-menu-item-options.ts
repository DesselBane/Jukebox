export interface AngularMenuItemOptions {
  click?: Function;
  type?: ('normal' | 'separator')
  label?: string;
  accelerator?: string;
  icon?: string;
  enabled?: boolean;
  visible?: boolean;
  id?: string;
  position?: string;
}
