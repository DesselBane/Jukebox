import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  private _route: ActivatedRoute;
  private _router: Router;
  private _authenticationService: AuthenticationService;
  private _snackBar: MatSnackBar;
  private returnUrl: string;

  constructor(route: ActivatedRoute,
              router: Router,
              authenticationService: AuthenticationService,
              snackBar: MatSnackBar) {
    this._route = route;
    this._router = router;
    this._authenticationService = authenticationService;
    this._snackBar = snackBar;
  }

  ngOnInit() {
    // reset login status
    AuthenticationService.logout();


  }

}
