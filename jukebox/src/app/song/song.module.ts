import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongSelectionComponent} from "./song-selection/song-selection.component";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {PlayerModule} from "../player/player.module";
import {SongRoutingModule} from "./song-routing.module";
import {SongService} from "./song.service";
import {ArtistOverviewComponent} from './artist-overview/artist-overview.component';
import {SongSearchComponent} from './song-search/song-search.component';
import { AlbumOverviewComponent } from './album-overview/album-overview.component';

@NgModule({
  imports: [
    SongRoutingModule,
    CommonModule,
    MaterialMetaModule,
    PlayerModule
  ],
  declarations: [
    SongSelectionComponent,
    ArtistOverviewComponent,
    SongSearchComponent,
    AlbumOverviewComponent
  ],
  providers: [
    SongService
  ]
})
export class SongModule { }
