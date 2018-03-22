import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from "../navigation.service";
import {NavItem} from "../models/nav-item";
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit, OnDestroy {
  private _navigation: NavigationService;
  public _navItems: NavItem[];
  private mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  @ViewChild(MatSidenav)
  private sidenav: MatSidenav;
  private _lastQuery: boolean = undefined;

  constructor(navigation: NavigationService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this._navigation = navigation;
    this._navItems = this._navigation.currentNavItems;

    this._navigation.navItems.subscribe(value => {
      this._navItems = value;
    });
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    //setInterval(() => this.makeSidenavResponsveAgain(), 1000);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
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
      this.sidenav.mode = "push";
      this.sidenav.open();
    }
  }

  changeSidenav() {
    if (this.sidenav.mode == "over") {
      this.sidenav.mode = "push";
    }
    else
      this.sidenav.mode = "over";
  }

}
