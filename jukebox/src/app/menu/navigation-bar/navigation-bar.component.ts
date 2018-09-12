import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, map} from 'rxjs/operators';
import {AngularMenuItem} from '../models/angular-menu-item';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public _navItems: AngularMenuItem[];
  private _navigation: NavigationService;
  @ViewChild(MatSidenav)
  private sidenav: MatSidenav;
  private _lastQuery: boolean = undefined;
  private _resizeEvent: Observable<void>;

  constructor(navigation: NavigationService, media: MediaMatcher) {
    this._navigation = navigation;
    this._navItems = this._navigation.navItemsRepo;

    this._navigation.navItemsChanged.subscribe(value => {
      this._navItems = value;
    });

      this._mobileQuery = media.matchMedia('(max-width: 600px)');

      this._resizeEvent = fromEvent(window, 'resize')
        .pipe(
          map(() => {
          }),
          debounceTime(200)
        );

      this._resizeEvent.subscribe(() => this.makeSidenavResponsveAgain());
  }

  private _mobileQuery: MediaQueryList;

  get mobileQuery(): MediaQueryList {
    return this._mobileQuery;
  }

  ngOnInit() {
      this.makeSidenavResponsveAgain();
  }

  makeSidenavResponsveAgain(): void {

    if (this._lastQuery != undefined && this._lastQuery === this._mobileQuery.matches)
      return;

    this._lastQuery = this._mobileQuery.matches;

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
    if (this._mobileQuery.matches)
      this.sidenav.toggle();
  }

}
