import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {FormsModule} from "@angular/forms";
import {MaterialMetaModule} from "./material-meta/material-meta.module";
import {AuthGuard} from "./security/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpClientErrorInterceptor} from "./shared/HttpClientErrorInterceptor";
import {AuthenticationInterceptor} from "./shared/AuthenticationInterceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {SecurityModule} from "./security/security.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    MaterialMetaModule,
    HttpClientModule,
    SecurityModule,

    //Has to be last !!!
    AppRoutingModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpClientErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
