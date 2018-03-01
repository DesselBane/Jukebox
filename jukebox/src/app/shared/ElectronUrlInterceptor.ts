import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ElectronService} from "ngx-electron";

@Injectable()
export class ElectronUrlInterceptor implements HttpInterceptor {
  private _electronService: ElectronService;

  constructor(electronService: ElectronService)
  {
    this._electronService = electronService;

  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let newReq = req;

    if(this._electronService.isElectronApp)
      newReq = req.clone({ url: 'http://localhost:5000' + req.urlWithParams});


    return next.handle(newReq);
  }
}
