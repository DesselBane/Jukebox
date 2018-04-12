import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SongSelectionComponent} from "./song-selection/song-selection.component";
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {PlayerModule} from "../player/player.module";
import {SongRoutingModule} from "./song-routing.module";
import {SongService} from "./song.service";
import {ArtistOverviewComponent} from './artist-overview/artist-overview.component';
import {SongSearchComponent} from './song-search/song-search.component';
import {AlbumOverviewComponent} from './album-overview/album-overview.component';
import {SongOverviewComponent} from './song-overview/song-overview.component';
import {ArtistDetailsComponent} from './artist-details/artist-details.component';
import {AlbumDetailsComponent} from './album-details/album-details.component';

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
    AlbumOverviewComponent,
    SongOverviewComponent,
    ArtistDetailsComponent,
    AlbumDetailsComponent
  ],
  providers: [
    SongService
  ]
})
export class SongModule { }
