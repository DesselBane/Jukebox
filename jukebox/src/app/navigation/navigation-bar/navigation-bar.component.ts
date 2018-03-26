import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from "../navigation.service";
import {NavItem} from "../models/nav-item";
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from "@angular/material";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/fromEvent";


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  private _navigation: NavigationService;
  public _navItems: NavItem[];
  private mobileQuery: MediaQueryList;

  @ViewChild(MatSidenav)
  private sidenav: MatSidenav;
  private _lastQuery: boolean = undefined;
  private _resizeEvent: Observable<void>;

  constructor(navigation: NavigationService, media: MediaMatcher) {
    this._navigation = navigation;
    this._navItems = this._navigation.currentNavItems;

    this._navigation.navItems.subscribe(value => {
      this._navItems = value;
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');

    this._resizeEvent = Observable.fromEvent(window, 'resize')
      .map(() => {
      })
      .debounceTime(200);

    this._resizeEvent.subscribe(() => this.makeSidenavResponsveAgain());
  }

  ngOnInit() {
    this.makeSidenavResponsveAgain();
  }

  makeSidenavResponsveAgain(): void {
    if (this._lastQuery != undefined && this._lastQuery === this.mobileQuery.matches)
      return;

    this._lastQuery = this.mobileQuery.matches;

    if (this._lastQuery) {
      this.sidenav.mode = "over";
      this.sidenav.close();
    }
    else {
      this.sidenav.mode = "side";
      this.sidenav.open();
    }
  }

  navItemClicked() {
    if (this.mobileQuery.matches)
      this.sidenav.toggle();
  }

}
