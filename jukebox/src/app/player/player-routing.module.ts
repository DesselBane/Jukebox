import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {PlayerSelectionComponent} from "./player-selection/player-selection.component";
import {ActivePlayerNeededGuard} from "./guards/active-player-needed.guard";
import {WebPlayerComponent} from "./web-player/web-player.component";
import {AuthGuard} from "../security/auth.guard";
import {CreatePlayerComponent} from "./create-player/create-player.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'player',
        children: [
          {path: 'select', component: PlayerSelectionComponent},
          {path: 'web', component: WebPlayerComponent, canActivate: [AuthGuard, ActivePlayerNeededGuard]},
          {path: 'create', component: CreatePlayerComponent, canActivate: [AuthGuard]}
        ]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PlayerRoutingModule {
}
