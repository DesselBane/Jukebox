import {Component, Inject, OnInit} from '@angular/core';
[Imports...]

@Component({
  selector: 'app-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.css']
})
export class FilePickerDialogComponent implements OnInit {
  private readonly _config: FilePickerConfig;
  private _filePickerService: FilePickerService;
  private _dialogRef: MatDialogRef<FilePickerDialogComponent>;

  constructor(
    dialogRef: MatDialogRef<FilePickerDialogComponent>, |\label{line:filePicker_dialogRef}|
    @Inject(MAT_DIALOG_DATA) config: FilePickerConfig, |\label{line:filePicker_config}|
    filePickerService: FilePickerService) {
      this._dialogRef = dialogRef;
      this._config = config;
      this._filePickerService = filePickerService;
  }

  public done() {
    this._config.selection.push(this._selectedPath.directoryFullPath);
    this._dialogRef.close(); |\label{line:filePicker_close}|
  }

  public cancle() {
    this._dialogRef.close();
  }

  [...]
}
