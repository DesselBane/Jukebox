import {Component, OnInit} from '@angular/core';
[Imports...]

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private _isIndexing: boolean;
  private _settingsService: SettingsService;
  private _dialog: MatDialog;

  constructor(settingsService: SettingsService, dialog: MatDialog) { |\label{line:dialog_injected}|
    this._settingsService = settingsService;
    this._dialog = dialog;
  }
[...]
  public addPath() {
    let filePickerConfig = new FilePickerConfig();
    filePickerConfig.selectDirectory = true;

    this._dialog.open(FilePickerDialogComponent, { |\label{line:dialog_open}|
      data: filePickerConfig |\label{line:dialog_filePickerConfig}|
    }).afterClosed()
      .mergeMap(() => {
        if (filePickerConfig.selection.length < 1)
          return Observable.empty<void>();

        this._musicPaths.push(filePickerConfig.selection[0]);
        return this._settingsService.setMusicPaths(this._musicPaths);
      })
      .subscribe();
  }
[...]
}
