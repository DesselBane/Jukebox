import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CanDeactivateGuard} from "../security/can-deactivate.guard";
import {SaveChangesDialogComponent} from './save-changes-dialog/save-changes-dialog.component';
import {MaterialMetaModule} from "../material-meta/material-meta.module";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule
  ],
  declarations: [SaveChangesDialogComponent],
  providers: [
    CanDeactivateGuard
  ],
  bootstrap: [SaveChangesDialogComponent]
})
export class SharedModule {
}
