import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if user is already authenticated on service initialization
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    this.http.get<{ authenticated: boolean }>('/api/auth/status').subscribe({
      next: (response) => {
        this.isAuthenticatedSubject.next(response.authenticated);
      },
      error: () => {
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/login', { username, password }).pipe(
      tap(() => this.isAuthenticatedSubject.next(true))
    );
  }

  logout(): Observable<any> {
    return this.http.post('/api/logout', {}).pipe(
      tap(() => this.isAuthenticatedSubject.next(false))
    );
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
} 