import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FilePickerConfig} from "../models/file-picker-config";

@Component({
  selector: 'app-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.css']
})
export class FilePickerDialogComponent implements OnInit {
  public testInput: string;
  private _dialogRef: MatDialogRef<FilePickerDialogComponent>;

  constructor(dialogRef: MatDialogRef<FilePickerDialogComponent>, @Inject(MAT_DIALOG_DATA) config: FilePickerConfig) {
    this._dialogRef = dialogRef;
    this._config = config;
  }

  private _config: FilePickerConfig;

  get config(): FilePickerConfig {
    return this._config;
  }

  ngOnInit() {
  }

  public done() {
    this._config.selection.push(this.testInput);
    this._dialogRef.close();
  }

}
