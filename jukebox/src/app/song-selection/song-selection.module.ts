import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionComponent } from './selection/selection.component';
import {SongSelectionRoutingModule} from "./song-selection-routing.module";
import {NavigationService} from "../navigation/navigation.service";
import {NavItem} from "../navigation/models/nav-item";

@NgModule({
  imports: [
    CommonModule,
    SongSelectionRoutingModule
  ],
  declarations: [SelectionComponent]
})
export class SongSelectionModule {
  constructor(navigation: NavigationService)
  {
    navigation.registerNavItem(new NavItem("Home","home"));
  }
}
