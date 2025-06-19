import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'mz-forgotpw',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgotpw.component.html',
  styleUrl: './forgotpw.component.css'
})
export class ForgotpwComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  doForgotPw(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.http.post('/api/login/forgot', {
      email: this.email
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'If an account exists with this email, you will receive password reset instructions shortly.';
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        if (error.status >= 500) {
          this.errorMessage = 'An error occurred. Please try again later.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }
}
