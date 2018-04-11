import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {DirectoryResponse} from "./models/directory-response";

@Injectable()
export class FilePickerService {
  private _http: HttpClient;

  constructor(http: HttpClient) {
    this._http = http;
  }

  public getDirectoryContents(path?: string): Observable<DirectoryResponse[]> {
    return this._http.get<DirectoryResponse[]>(`api/files/info?path=${path != null ? path : ""}`);
  }

}
