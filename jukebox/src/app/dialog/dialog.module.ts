import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {SecurityModule} from "../security/security.module";
import {RouterModule} from "@angular/router";
import {SaveChangesDialogComponent} from "./save-changes-dialog/save-changes-dialog.component";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    RouterModule,
    SecurityModule
  ],
  declarations: [
    SaveChangesDialogComponent,
  ],
  bootstrap: [
    SaveChangesDialogComponent
  ]
})
export class DialogModule {
}
