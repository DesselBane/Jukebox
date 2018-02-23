import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ResetPasswordComponent} from './resetPassword/resetPassword.component';
import {ChangePasswordComponent} from './changePassword/changePassword.component';
import {RegisterComponent} from './register/register.component';
import {LoginComponent} from './login/login.component';
import {SecurityRoutingModule} from './security-routing.module';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {AuthenticationService} from "./authentication.service";
import {CanDeactivateGuard} from "./can-deactivate.guard";
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SecurityRoutingModule,
    MaterialMetaModule
  ],
  declarations: [
    RegisterComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    LoginComponent,
    LogoutComponent
  ],
  providers:[
    AuthenticationService,
    CanDeactivateGuard
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecurityModule {

  constructor(auth: AuthenticationService)
  {
      auth.initialize();
  }
}
