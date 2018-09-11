import {Observable} from 'rxjs';

export interface ICanComponentDeactivate {
  canDeactivate(): Observable<boolean>;
}
