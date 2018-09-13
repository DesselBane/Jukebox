import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationService} from '../navigation.service';
import {MatSidenav} from '@angular/material';
import {AngularNavItem} from '../models/angular-nav-item';
import {Location} from '@angular/common';


@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {

  public _navItems: AngularNavItem[];
  private _navigation: NavigationService;
  @ViewChild(MatSidenav)
  private sidenav: MatSidenav;
  public _isExpanded: boolean;
  private _location: Location;

  constructor(navigation: NavigationService,
              location: Location) {
    this._navigation = navigation;
    this._navItems = this._navigation.navItemsRepo;
    this._location = location;

    this._navigation.navItemsChanged.subscribe(value => {
      this._navItems = value;
    });
  }

  ngOnInit() {
  }

  navItemClicked() {
    this._isExpanded = false;
  }

  action_back(): void {
    this._location.back();
  }

  newSidenavToggle(): void {
    this._isExpanded = !this._isExpanded;
  }

}
