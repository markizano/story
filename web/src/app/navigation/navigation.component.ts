import { Component } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  routes: Routes;

  constructor() {
    this.routes = routes;
  }
}
