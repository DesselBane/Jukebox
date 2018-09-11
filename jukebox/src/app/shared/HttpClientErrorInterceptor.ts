import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, of, throwError} from 'rxjs';
import {AuthenticationService} from '../security/authentication.service';
import {catchError, mergeMap} from 'rxjs/operators';

@Injectable()
export class HttpClientErrorInterceptor implements HttpInterceptor {
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    return next.handle(req).pipe(
      catchError((err) => {
        // Nothing we need to handle, passing on the error
        if (!(err instanceof HttpErrorResponse)) {
          return throwError(err);
        }

        // These URLs may return a 401 which is intended for the frontend and should not be seen as resolvable
        // passing on the error
        if (err.status !== 401 || err.url.toLowerCase().includes('api/auth')) {

          return throwError(err);
        }

        // Trying to reload the access token
        // Generating a new request
        const authReq = AuthenticationService.createRefreshHttpRequest();

        return next.handle(authReq).pipe(
          catchError(error => {
            // Refresh Token failed. Redirecting the user to the login page
            AuthenticationService.logout();
            this._router.navigate(['/auth/login'], {queryParams: {returnUrl: this._router.url, reason: 'sessionTimeout'}});
            throw error;
          }),
          mergeMap((value) => {
              // Checking if a HttpResponse came back
              if (value instanceof HttpResponse) {
                // Setting the new Token an retrying the old request
                AuthenticationService.loginTokenResponse = value.body;
                return next.handle(req.clone());
              }
              return of<HttpEvent<any>>(value as HttpEvent<any>);
            }
          ));
      }));
  }
}

