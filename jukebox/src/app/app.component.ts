import { Component } from '@angular/core';
import {NavItem} from "./shared/models/nav-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  navItems = [
    new NavItem("Login","auth/login"),
    new NavItem("Register","auth/register"),
    new NavItem("Home","home")
  ];

  constructor()
  {

  }

}
