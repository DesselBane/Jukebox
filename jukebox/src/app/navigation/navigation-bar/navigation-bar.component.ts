import { Component, OnInit } from '@angular/core';
import {NavigationService} from "../navigation.service";
import {NavItem} from "../models/nav-item";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  private _navigation: NavigationService;
  private _navItems: NavItem[];

  constructor(navigation: NavigationService) {
    this._navigation = navigation;
    this._navItems = this._navigation.currentNavItems;

    this._navigation.navItems.subscribe(value => {
      this._navItems = value;
    });
  }

  ngOnInit() {
  }

}
