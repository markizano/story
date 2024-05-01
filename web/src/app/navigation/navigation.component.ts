import { Component } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
// import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'navigation',
  // providers: [NgxPermissionsService],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // NgxPermissionsModule
  ],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  routes: Routes;

  constructor(/*protected ngxService: NgxPermissionsService*/) {
    this.routes = routes;
  }

}
