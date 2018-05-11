import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-save-changes-dialog',
  templateUrl: './save-changes-dialog.component.html',
  styleUrls: ['./save-changes-dialog.component.css']
})
export class SaveChangesDialogComponent implements OnInit {
  get content(): string {
    return this._content;
  }

  set content(value: string) {
    this._content = value;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }

  private _title = "Ungespeicherte Änderungen!";
  private _content = "Sind Sie sicher, dass Sie die Seite verlassen wollen? Alle ungespeicherten Änderungen gehen verloren!";

  constructor() {
  }

  ngOnInit() {
  }

}
