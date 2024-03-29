import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {MaterialMetaModule} from "./material-meta/material-meta.module";
import {AuthGuard} from "./security/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpClientErrorInterceptor} from "./shared/HttpClientErrorInterceptor";
import {AuthenticationInterceptor} from "./shared/AuthenticationInterceptor";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AppRoutingModule} from "./app-routing.module";
import {SecurityModule} from "./security/security.module";
import {PlayerModule} from "./player/player.module";
import {SongModule} from "./song/song.module";
import {NgxElectronModule} from "ngx-electron";
import {ElectronUrlInterceptor} from "./shared/ElectronUrlInterceptor";
import {NotificationModule} from "./notification/notification.module";
import {SettingsModule} from "./settings/settings.module";
import {FilePickerModule} from "./file-picker/file-picker.module";
import {MenuModule} from "./menu/menu.module";
import {DialogModule} from "./dialog/dialog.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialMetaModule,
    HttpClientModule,
    NgxElectronModule,

    //App Modules load here
    DialogModule,
    SecurityModule,
    PlayerModule,
    SongModule,
    NotificationModule,
    SettingsModule,
    FilePickerModule,
    MenuModule,

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
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ElectronUrlInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
