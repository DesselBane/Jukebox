import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ChangePasswordComponent} from './changePassword/changePassword.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ResetPasswordComponent} from './resetPassword/resetPassword.component';
import {LogoutComponent} from "./logout/logout.component";
import {AuthGuard} from "./auth.guard";


@NgModule({
  imports: [
    RouterModule.forChild([{
      path: 'auth',
      children: [
        {path: 'changePassword', component: ChangePasswordComponent},
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'resetPassword', component: ResetPasswordComponent},
        {path:'logout', component: LogoutComponent, canActivate: [AuthGuard]}
      ]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class SecurityRoutingModule {
}
