import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerSelectionComponent } from './player-selection/player-selection.component';
import {PlayerService} from "./player.service";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {NavigationService} from "../navigation/navigation.service";
import {NavItem} from "../navigation/models/nav-item";
import {PlayerRoutingModule} from "./player-routing.module";
import { CurrentPlayerStatusComponent } from './current-player-status/current-player-status.component';
import { SongSelectionComponent } from '../song/song-selection/song-selection.component';
import {ActivePlayerNeededGuard} from "./guards/active-player-needed.guard";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    PlayerRoutingModule
  ],
  declarations: [
    PlayerSelectionComponent,
    CurrentPlayerStatusComponent
  ],
  providers: [
    PlayerService,
    ActivePlayerNeededGuard
  ],
  exports: [
    CurrentPlayerStatusComponent
  ]
})
export class PlayerModule {
  constructor(navService: NavigationService)
  {
    navService.registerNavItem(new NavItem("Home","home"));
    navService.registerNavItem(new NavItem("Select Player","player/select"));
  }
}
