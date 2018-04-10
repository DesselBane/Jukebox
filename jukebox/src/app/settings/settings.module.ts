import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {SettingsComponent} from './settings/settings.component';
import {NavigationService} from "../navigation/navigation.service";
import {NavItem} from "../navigation/models/nav-item";
import {SettingsRoutingModule} from "./settings-routing.module";
import {SettingsService} from "./settings.service";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    SettingsRoutingModule
  ],
  declarations: [
    SettingsComponent
  ],
  providers: [
    SettingsService
  ]
})
export class SettingsModule {
  constructor(navigationService: NavigationService) {
    let item = new NavItem('/settings', "Settings", "/settings");
    navigationService.registerNavItem(item);
  }
}
