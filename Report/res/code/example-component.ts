import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularMenuItem} from "../models/angular-menu-item";

@Component({
  selector: 'app-nav-item', |\label{line:comp_selector}|
  templateUrl: './nav-item.component.html', |\label{line:comp_templateUrl}|
  styleUrls: ['./nav-item.component.css'] |\label{line:comp_styleUrls}|
})
export class NavItemComponent implements OnInit { |\label{line:comp_OnInit}|

  @Input() |\label{line:comp_input}|
  CurrentItem: AngularMenuItem;
  @Output() |\label{line:comp_output}|
  ItemClicked = new EventEmitter();

  constructor() { }
  ngOnInit() {  } |\label{line:comp_ngOnInit}|
}
