import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'mz-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/stories';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Get return url from route parameters or default to '/stories'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/stories';
  }

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 401 || error.status === 403) {
          this.errorMessage = 'Invalid username or password. Please try again.';
        } else if (error.status >= 500) {
          this.errorMessage = 'An error occurred. Please try again later.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['login', 'forgot']);
  }
}
