import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NavItem} from "../models/nav-item";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  @Input()
  CurrentItem: NavItem;

  @Output()
  ItemClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  needsExpander() : boolean
  {
    let retVal = false;

    this.CurrentItem.subItems.forEach(item => {
      if(item.isVisible)
        retVal = true;
    });

    return retVal;
  }

}
