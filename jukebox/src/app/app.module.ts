import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import {SharedModule} from "./shared/shared.module";
import {FormsModule} from "@angular/forms";
import {MaterialMetaModule} from "./material-meta/material-meta.module";
import {AuthGuard} from "./security/auth.guard";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {HttpClientErrorInterceptor} from "./security/HttpClientErrorInterceptor";
import {AuthenticationInterceptor} from "./security/AuthenticationInterceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    MaterialMetaModule
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
