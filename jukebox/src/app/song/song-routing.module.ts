import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SongSelectionComponent} from "./song-selection/song-selection.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'home',
        component: SongSelectionComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SongRoutingModule{}
