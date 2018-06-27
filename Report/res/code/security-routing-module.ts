import {NgModule} from '@angular/core';
[Imports ...]


@NgModule({
  imports: [
    RouterModule.forChild([{ |\label{line:routing_forChild}|
      path: 'auth',
      children: [ |\label{line:routing_children}|
        {path: 'changePassword', component: ChangePasswordComponent}, |\label{line:routing_simpleComponent}|
        {path: 'login', component: LoginComponent},
        {path: 'register', component: RegisterComponent},
        {path: 'resetPassword', component: ResetPasswordComponent},
        {path: 'logout', component: LogoutComponent, canActivate: [AuthGuard]} |\label{line:routing_guard}|
      ]
    }])
  ],
  exports: [
    RouterModule
  ]
})
export class SecurityRoutingModule {
}
