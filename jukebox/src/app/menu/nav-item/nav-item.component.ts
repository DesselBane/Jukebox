import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AngularNavItem} from '../models/angular-nav-item';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

  @Input()
  CurrentItem: AngularNavItem;

  @Input()
  IsExpanded: boolean;

  @Output()
  ItemClicked = new EventEmitter();
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  ngOnInit() {
  }

  public itemClickHandler() {
    this.ItemClicked.emit();
    this._router.navigateByUrl(this.CurrentItem.location);
  }

}
