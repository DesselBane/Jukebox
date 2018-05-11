/**
 * Created by hgx on 21.04.17.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import '../rxjs-extensions';
import {Observable} from 'rxjs/Observable';
import {ILoginTokenResponse} from "../shared/models/ilogin-token-response";
import {LoginTokenModel} from "../shared/models/login-token-model";
import {NavigationService} from "../menu/navigation.service";
import {ElectronService} from "ngx-electron";
import {AngularMenuItem} from "../menu/models/angular-menu-item";

@Injectable()
export class AuthenticationService {
  private _navigation: NavigationService;
  private _electronService: ElectronService;
  private static _isElectronApp: boolean = false;

  private static _loginItem: AngularMenuItem;
  private static _registerItem: AngularMenuItem;
  private static _logoutItem: AngularMenuItem;

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

  private static isInitialized = false;

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
    this.updateNavItems();
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
    this.updateNavItems();
  }

  private static updateNavItems() {
    if (!AuthenticationService.isInitialized)
      return;

    if (AuthenticationService.loginToken != null && this.loginToken.isValid()) {
      AuthenticationService._logoutItem.visible = true;
      AuthenticationService._loginItem.visible = false;
      AuthenticationService._registerItem.visible = false;
    }
    else {
      AuthenticationService._logoutItem.visible = false;
      AuthenticationService._loginItem.visible = true;
      AuthenticationService._registerItem.visible = true;
    }
  }

  login(username: string, password: string): Observable<ILoginTokenResponse> {
    return this.http.post<ILoginTokenResponse>('/api/auth/login', JSON.stringify(
      {
        username: username,
        password: password
      }))
      .do(response => {
        AuthenticationService.loginTokenResponse = response;
        AuthenticationService.updateNavItems();
      });
  }

  refreshToken() : Observable<void>
  {
    return this.http.get('/api/ping', {responseType: 'text'})
      .map(() => { });
  }

  changePassword(password: string, resetHash: string): Observable<void> {
    return this.http.post('/api/auth/changePassword', JSON.stringify(
      {
        password: password,
        resetHash: resetHash
      }), {responseType: 'text'}).map(() => {});
  }

  resetPassword(username: string): Observable<void> {
    return this.http.post('/api/auth/resetPassword?username=' + username, '', {responseType: 'text'})
      .map(() => {
    })
  }

  register(username: string): Observable<void> {
    return this.http.put(`/api/auth/register?username=${username}`, '', {responseType: 'text'}).map(() => {
    });
  }

  public initialize() {
    if (AuthenticationService.isInitialized)
      return;
    AuthenticationService.isInitialized = true;

    AuthenticationService._loginItem = this._navigation.findNavItem('account/login');
    AuthenticationService._registerItem = this._navigation.findNavItem('account/register');
    AuthenticationService._logoutItem = this._navigation.findNavItem('account/logout');

    AuthenticationService.updateNavItems();

  }

}
