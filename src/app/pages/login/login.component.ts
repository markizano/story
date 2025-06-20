import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/stories']);
    }
  }

  doLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.username, this.password).subscribe({
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message;
      },
      complete: () => {
        this.isLoading = false;
        this.router.navigate(['/stories']);
      }
    })
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot']);
  }
}
