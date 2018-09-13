/**
 * Created by hgx on 21.04.17.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {ILoginTokenResponse} from '../shared/models/ilogin-token-response';
import {LoginTokenModel} from '../shared/models/login-token-model';
import {NavigationService} from '../menu/navigation.service';
import {ElectronService} from 'ngx-electron';

@Injectable()
export class AuthenticationService {
  private _navigation: NavigationService;
  private _electronService: ElectronService;
  private static _isElectronApp: boolean = false;

  constructor(private http: HttpClient, navigation: NavigationService, electronService: ElectronService) {
    this._navigation = navigation;
    this._electronService = electronService;

    if (this._electronService.isElectronApp) {
      AuthenticationService._isElectronApp = true;
      AuthenticationService.logout();
      this.login("", "").subscribe();
    }
    else {
      // set token if saved in local storage
      let storeToken = JSON.parse(localStorage.getItem('loginToken'));
      if (storeToken != null && storeToken instanceof LoginTokenModel)
        AuthenticationService.loginTokenResponse = LoginTokenModel.parse(storeToken);
    }

  }

  private static _loginToken: LoginTokenModel;

  static get loginToken(): LoginTokenModel {

    if (AuthenticationService._loginToken == null) {
      let storageToken = JSON.parse(localStorage.getItem('loginToken'));

      if (storageToken == null)
        return null;

      AuthenticationService._loginToken = LoginTokenModel.parse(storageToken);
    }

    return AuthenticationService._loginToken;
  }

  static set loginTokenResponse(value: ILoginTokenResponse) {
    let newToken = LoginTokenModel.parse(value);

    if (!newToken.isValid())
      throw new Error("Cannot set expired Token");

    localStorage.setItem('loginToken', JSON.stringify(newToken));
    AuthenticationService._loginToken = newToken;
  }

  static isAuthenticated(): boolean {
    if (this.isLoggedIn() == false) {
      return false;
    }

    return this.loginToken.isValid();
  }

  static isLoggedIn(): boolean {
    return AuthenticationService.loginToken != null;
  }

  static createRefreshHttpRequest(): HttpRequest<any> {
    if (this._isElectronApp)
      return new HttpRequest<any>('POST', 'api/auth/login', JSON.stringify({
        username: "",
        password: ""
      }));

    return new HttpRequest<any>('POST', '/api/auth/refreshToken', JSON.stringify(AuthenticationService.loginToken));
  }

  static logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('loginToken');
    AuthenticationService._loginToken = null;
  }

  login(username: string, password: string): Observable<ILoginTokenResponse> {
    return this.http.post<ILoginTokenResponse>('/api/auth/login', JSON.stringify(
      {
        username: username,
        password: password
      }))
      .pipe(tap(response => {
        AuthenticationService.loginTokenResponse = response;
      }));
  }

  refreshToken() : Observable<void>
  {
    return this.http.get('/api/ping', {responseType: 'text'})
      .pipe(map(() => {
      }));
  }

  changePassword(password: string, resetHash: string): Observable<void> {
    return this.http.post('/api/auth/changePassword', JSON.stringify(
      {
        password: password,
        resetHash: resetHash
      }), {responseType: 'text'})
      .pipe(map(() => {
      }));
  }

  resetPassword(username: string): Observable<void> {
    return this.http.post('/api/auth/resetPassword?username=' + username, '', {responseType: 'text'})
      .pipe(map(() => {
      }));
  }

  register(username: string): Observable<void> {
    return this.http.put(`/api/auth/register?username=${username}`, '', {responseType: 'text'}).pipe(map(() => {
    }));
  }
}
