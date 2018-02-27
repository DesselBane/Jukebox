import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SongSelectionComponent} from "./song-selection/song-selection.component";
import {ActivePlayerNeededGuard} from "../player/guards/active-player-needed.guard";

@NgModule({
  imports: [
    RouterModule.forChild([
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
export class SongRoutingModule{}
