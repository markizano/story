import { Injectable } from '@angular/core';
import { Router, CanActivate, CanActivateChild, CanDeactivate, CanMatch } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanMatch  {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
      return this.checkAuth();
    }

    canActivateChild(): boolean {
      return this.checkAuth();
    }

    canMatch(): boolean {
      return this.checkAuth();
    }

    private checkAuth(): boolean {
      if (this.authService.isAuthenticated()) {
        return true;
      } else {
        this.router.navigate(['/auth/login']);
        return false;
      }
    }
  
  }