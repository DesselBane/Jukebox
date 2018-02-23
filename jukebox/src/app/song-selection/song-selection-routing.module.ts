import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SelectionComponent} from "./selection/selection.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'home',
        component: SelectionComponent
      }
    ])
  ],
  exports:[
    RouterModule
  ]
})
export class SongSelectionRoutingModule {
}
