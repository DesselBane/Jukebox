import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanDeactivateGuard} from "../security/can-deactivate.guard";
import {SaveChangesDialogComponent} from './save-changes-dialog/save-changes-dialog.component';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import { NavItemComponent } from './nav-item/nav-item.component';
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    RouterModule
  ],
  declarations: [
    SaveChangesDialogComponent,
    NavItemComponent],
  providers: [
    CanDeactivateGuard
  ],
  exports:[
    NavItemComponent
  ],
  bootstrap: [SaveChangesDialogComponent]
})
export class SharedModule {
}
