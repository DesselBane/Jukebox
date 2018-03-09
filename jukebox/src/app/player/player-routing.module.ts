import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {PlayerSelectionComponent} from "./player-selection/player-selection.component";
import {SongSelectionComponent} from "../song/song-selection/song-selection.component";
import {ActivePlayerNeededGuard} from "./guards/active-player-needed.guard";
import {WebPlayerComponent} from "./web-player/web-player.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'player',
        children: [
          {path: 'select', component: PlayerSelectionComponent},
          {path: 'web', component: WebPlayerComponent}
        ]
      },
      {
        path: 'home',
        component: SongSelectionComponent,
        canActivate: [ActivePlayerNeededGuard]
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class PlayerRoutingModule {
}
