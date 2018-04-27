import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SystemTrayService} from "./system-tray.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    SystemTrayService
  ]
})
export class SystemTrayModule {
  constructor(trayService: SystemTrayService) {
    trayService.initialize();
  }
}
