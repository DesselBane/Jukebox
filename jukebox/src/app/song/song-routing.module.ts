import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {SongSelectionComponent} from "./song-selection/song-selection.component";
import {ArtistDetailsComponent} from "./artist-details/artist-details.component";
import {AlbumDetailsComponent} from "./album-details/album-details.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'home',
        component: SongSelectionComponent
      },
      {
        path: 'song/artist-details/:artistId',
        component: ArtistDetailsComponent
      },
      {
        path: 'song/album-details/:albumId',
        component: AlbumDetailsComponent
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class SongRoutingModule{}
