import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SongSelectionComponent} from "./song-selection/song-selection.component";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {PlayerModule} from "../player/player.module";
import {SongRoutingModule} from "./song-routing.module";
import {SongService} from "./song.service";

@NgModule({
  imports: [
    SongRoutingModule,
    CommonModule,
    MaterialMetaModule,
    PlayerModule
  ],
  declarations: [
    SongSelectionComponent
  ],
  providers: [
    SongService
  ]
})
export class SongModule { }
