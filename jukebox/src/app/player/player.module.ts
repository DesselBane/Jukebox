import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PlayerSelectionComponent} from './player-selection/player-selection.component';
import {PlayerService} from "./player.service";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {NavigationService} from "../navigation/navigation.service";
import {NavItem} from "../navigation/models/nav-item";
import {PlayerRoutingModule} from "./player-routing.module";
import {CurrentPlayerStatusComponent} from './current-player-status/current-player-status.component';
import {ActivePlayerNeededGuard} from "./guards/active-player-needed.guard";
import {WebPlayerComponent} from './web-player/web-player.component';
import {WebPlayerService} from "./web-player.service";
import {CreatePlayerComponent} from './create-player/create-player.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialMetaModule,
    PlayerRoutingModule
  ],
  declarations: [
    PlayerSelectionComponent,
    CurrentPlayerStatusComponent,
    WebPlayerComponent,
    CreatePlayerComponent
  ],
  providers: [
    PlayerService,
    ActivePlayerNeededGuard,
    WebPlayerService
  ],
  exports: [
    CurrentPlayerStatusComponent
  ]
})
export class PlayerModule {
  constructor(navService: NavigationService)
  {
    navService.registerNavItem(new NavItem("home","Home","home"));
    navService.registerNavItem(new NavItem("player/select","Select Player","player/select"));
    navService.registerNavItem(new NavItem("player/web","Player","player/web"));
  }
}
