import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuItemService} from "./menu-item.service";
import {NavigationService} from "./navigation.service";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {NavItemComponent} from "./nav-item/nav-item.component";
import {NavigationBarComponent} from "./navigation-bar/navigation-bar.component";
import {RouterModule} from "@angular/router";
import {SecurityModule} from "../security/security.module";
import {SystemTrayService} from "./system-tray.service";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    RouterModule,
    SecurityModule
  ],
  declarations: [
    NavItemComponent,
    NavigationBarComponent
  ],
  providers: [
    MenuItemService,
    NavigationService,
    SystemTrayService
  ],
  exports: [
    NavigationBarComponent
  ]
})
export class MenuModule {
}
