import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionComponent } from './selection/selection.component';
import {SongSelectionRoutingModule} from "./song-selection-routing.module";

@NgModule({
  imports: [
    CommonModule,
    SongSelectionRoutingModule
  ],
  declarations: [SelectionComponent]
})
export class SongSelectionModule { }
