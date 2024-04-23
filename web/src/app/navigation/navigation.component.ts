import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigation',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  routes: Routes = routes;
}
