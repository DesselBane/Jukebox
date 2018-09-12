import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularMenuItem} from '../models/angular-menu-item';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  @Input()
  CurrentItem: AngularMenuItem;

  @Input()
  IsExpanded: boolean;

  @Output()
  ItemClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public itemClickHandler() {
    this.ItemClicked.emit();
    this.CurrentItem.click();
  }

}
