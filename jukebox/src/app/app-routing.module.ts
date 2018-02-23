import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";

export const routes: Routes = [
  {path: 'home', loadChildren: './song-selection/song-selection.module#SongSelectionModule'},

  // otherwise redirect to home
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [
    // tracing only for debug purposes  ,{enableTracing: true}
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
