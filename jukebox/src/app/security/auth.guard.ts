/**
 * Created by hgx on 21.04.17.
 */
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

// auth.service
@Injectable()
export class AuthGuard implements CanActivate {
  private _authService: AuthenticationService;
  private _router: Router;

  constructor(router: Router, authService: AuthenticationService) {
    this._router = router;
    this._authService = authService;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (AuthenticationService.isLoggedIn()) {
      if (!AuthenticationService.isAuthenticated()) {
        return this._authService.refreshToken()
          .pipe(
            map(() => {
              return true;
            }),
            catchError(() => {
          this._router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
              return of(false);
            })
          );
      }
      // logged in so return true
      return of<boolean>(true);
    }

    // not logged in so redirect to login page
    this._router.navigate(['/auth/login'], {queryParams: {returnUrl: state.url}});
    return of<boolean>(false);
  }
}
