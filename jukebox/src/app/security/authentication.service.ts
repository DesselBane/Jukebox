/**
 * Created by hgx on 21.04.17.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpRequest} from '@angular/common/http';
import '../rxjs-extensions';
import {Observable} from 'rxjs/Observable';
import {ILoginTokenResponse} from "../shared/models/ilogin-token-response";
import {LoginTokenModel} from "../shared/models/login-token-model";
import {NavigationService} from "../navigation/navigation.service";
import {NavItem} from "../navigation/models/nav-item";

@Injectable()
export class AuthenticationService {
  private _navigation: NavigationService;

  constructor(private http: HttpClient, navigation: NavigationService) {
    this._navigation = navigation;
    // set token if saved in local storage
    let storeToken = JSON.parse(localStorage.getItem('loginToken'));
    if(storeToken !== null && storeToken instanceof LoginTokenModel)
      AuthenticationService.loginTokenResponse = LoginTokenModel.parse(storeToken);

  }

  private static _loginNav = new NavItem("auth/login","Login","auth/login");
  private static _registerNav = new NavItem("auth/register","Register","auth/register");
  private static _logoutNav = new NavItem("auth/logout","Logout", "auth/logout");
  private static _authParentItem = new NavItem("auth","Account","",[AuthenticationService._loginNav,AuthenticationService._registerNav, AuthenticationService._logoutNav], true);
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
    return new HttpRequest<any>('POST', '/api/auth/refreshToken', JSON.stringify(AuthenticationService.loginToken));
  }

  static logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('loginToken');
    AuthenticationService._loginToken = null;
    this.updateNavItems();
  }

  public initialize()
  {
    if(AuthenticationService.isInitialized)
      return;
    AuthenticationService.isInitialized = true;

    this._navigation.registerNavItem(AuthenticationService._authParentItem);

    AuthenticationService.updateNavItems();

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
    return this.http.get('/api/ping', {responseType: 'text'}).map(() => {
    });
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

  private static updateNavItems()
  {
    if (AuthenticationService.loginToken != null && this.loginToken.isValid())
    {
      console.log("logged in");
      AuthenticationService._logoutNav.isVisible = true;
      AuthenticationService._loginNav.isVisible = false;
      AuthenticationService._registerNav.isVisible = false;
    }
    else {
      console.log("NOT logged in");
      AuthenticationService._logoutNav.isVisible = false;
      AuthenticationService._loginNav.isVisible = true;
      AuthenticationService._registerNav.isVisible = true;
    }
  }

}
