import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FilePickerDialogComponent} from './file-picker-dialog/file-picker-dialog.component';
import {MaterialMetaModule} from "../material-meta/material-meta.module";
import {FormsModule} from "@angular/forms";
import {FilePickerService} from "./file-picker.service";

@NgModule({
  imports: [
    CommonModule,
    MaterialMetaModule,
    FormsModule
  ],
  declarations: [
    FilePickerDialogComponent
  ],
  providers: [
    FilePickerService
  ],
  bootstrap: [
    FilePickerDialogComponent
  ],
  entryComponents: [
    FilePickerDialogComponent
  ]
})
export class FilePickerModule {
}
