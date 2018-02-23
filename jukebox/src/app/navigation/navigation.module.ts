import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {RouterModule} from "@angular/router";
import {SaveChangesDialogComponent} from "./save-changes-dialog/save-changes-dialog.component";
import {NavItemComponent} from "./nav-item/nav-item.component";
import {SecurityModule} from "../security/security.module";
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import {NavigationService} from "./navigation.service";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    RouterModule,
    SecurityModule
  ],
  declarations: [
    SaveChangesDialogComponent,
    NavItemComponent,
    NavigationBarComponent
  ],
  providers: [
    NavigationService
  ],
  exports:[
    NavigationBarComponent
  ],
  bootstrap: [
    SaveChangesDialogComponent
  ]
})
export class NavigationModule { }
