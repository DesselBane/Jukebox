import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {FilePickerConfig} from "../models/file-picker-config";
import {FilePickerService} from "../file-picker.service";
import {DirectoryResponse} from "../models/directory-response";

@Component({
  selector: 'app-file-picker-dialog',
  templateUrl: './file-picker-dialog.component.html',
  styleUrls: ['./file-picker-dialog.component.css']
})
export class FilePickerDialogComponent implements OnInit {
  private readonly _config: FilePickerConfig;
  private _filePickerService: FilePickerService;
  private _dialogRef: MatDialogRef<FilePickerDialogComponent>;

  constructor(dialogRef: MatDialogRef<FilePickerDialogComponent>, @Inject(MAT_DIALOG_DATA) config: FilePickerConfig, filePickerService: FilePickerService) {
    this._dialogRef = dialogRef;
    this._config = config;
    this._filePickerService = filePickerService;
  }

  private _paths: DirectoryResponse[];

  get paths(): DirectoryResponse[] {
    return this._paths;
  }

  private _selectedPath: DirectoryResponse;

  get selectedPath(): DirectoryResponse {
    return this._selectedPath;
  }


  get config(): FilePickerConfig {
    return this._config;
  }

  ngOnInit() {
    this._filePickerService
      .getDirectoryContents()
      .subscribe(values => this._paths = values);
  }

  public done() {
    this._config.selection.push(this._selectedPath.directoryFullPath);
    this._dialogRef.close();
  }

  public onSelectPath(directory: DirectoryResponse) {
    this._selectedPath = directory;
  }

  public onAccessPath(directory?: DirectoryResponse) {
    this._filePickerService
      .getDirectoryContents(directory != null ? directory.directoryFullPath : "")
      .subscribe(values => this._paths = values);
  }

  cancle() {
    this._dialogRef.close();
  }
}
