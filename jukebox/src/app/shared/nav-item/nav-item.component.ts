import {Component, Input, OnInit} from '@angular/core';
import {NavItem} from "../models/nav-item";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  @Input()
  CurrentItem: NavItem;

  constructor() { }

  ngOnInit() {
  }

}
