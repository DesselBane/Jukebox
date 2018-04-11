import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../settings.service";
import {MatDialog} from "@angular/material";
import {FilePickerDialogComponent} from "../../file-picker/file-picker-dialog/file-picker-dialog.component";
import {FilePickerConfig} from "../../file-picker/models/file-picker-config";
import {Observable} from "rxjs/Observable";
import "../../rxjs-extensions";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private _isIndexing: boolean;
  private _settingsService: SettingsService;
  private _dialog: MatDialog;

  constructor(settingsService: SettingsService, dialog: MatDialog) {
    this._settingsService = settingsService;
    this._dialog = dialog;
  }

  private _musicPaths: string[];

  get isIndexing(): boolean {
    return this._isIndexing;
  }

  get musicPaths(): string[] {
    return this._musicPaths;
  }

  ngOnInit() {
    this._settingsService
      .getMusicPaths()
      .subscribe(paths => this._musicPaths = paths);
  }

  public addPath() {
    let filePickerConfig = new FilePickerConfig();
    filePickerConfig.selectDirectory = true;

    this._dialog.open(FilePickerDialogComponent, {
      data: filePickerConfig
    }).afterClosed()
      .mergeMap(() => {
        if (filePickerConfig.selection.length < 1)
          return Observable.empty<void>();

        this._musicPaths.push(filePickerConfig.selection[0]);
        return this._settingsService.setMusicPaths(this._musicPaths);
      })
      .subscribe();
  }

  public removePath(path: string) {
    let indexOfPath = this._musicPaths.indexOf(path);

    if (indexOfPath === -1)
      return;

    this._musicPaths.splice(indexOfPath, 1);

    this._settingsService
      .setMusicPaths(this._musicPaths)
      .subscribe();
  }

  public startIndexing() {
    this._isIndexing = this._settingsService.isIndexing;
    this._settingsService
      .startIndexing()
      .subscribe(() => this._isIndexing = this._settingsService.isIndexing);
  }
}
