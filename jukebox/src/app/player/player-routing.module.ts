import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {PlayerSelectionComponent} from "./player-selection/player-selection.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'player',
        children: [
          {path: 'select', component: PlayerSelectionComponent}
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
