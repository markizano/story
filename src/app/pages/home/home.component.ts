import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mz-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToSignup(): void {
    this.router.navigate(['/auth/signup']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToStories(): void {
    this.router.navigate(['/stories']);
  }
}
