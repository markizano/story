import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthStatus } from 'app/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  /**
   * Synchronous action to check if we are authenticated.
   * Called on first page load.
   */
  checkAuthStatus(): void {
    const authCheck = {
        'token': localStorage.getItem('authToken') ?? ''
    }
    this.http.post<AuthStatus>('/api/auth/status', authCheck).subscribe({
      next: (response) => {
        if ( response.auth.valid ) {
            if ( !response.user ) {
                throw new Error('User not set yet authenticated?? This should not happen!')
            }
            localStorage.setItem('authToken', response.auth.token);
            localStorage.setItem('sessionExpiry', <string>response.auth.expires);
            localStorage.setItem('user', JSON.stringify(response.user));
        } else {
            localStorage.setItem('authToken', '');
            localStorage.setItem('sessionExpiry', new Date( Date.now() - 1000 ).toISOString());
            localStorage.setItem('user', '{}');
        }
      },
      error: (err: any) => {
        throw new Error(`Exception checking auth: ${err}`);
      }
    });
  }

  login(username: string, password: string): Observable<any> {
    return new Observable(observer => {
      this.http.post<AuthStatus>('/api/auth/login', { username, password }).subscribe({
        next: (response: AuthStatus) => {
          if (response.auth.valid && response.user) {
            localStorage.setItem('authToken', response.auth.token);
            localStorage.setItem('sessionExpiry', <string>response.auth.expires);
            localStorage.setItem('user', JSON.stringify(response.user));
            observer.next(response);
            observer.complete();
          } else {
            observer.error({ status: 401, message: 'Invalid credentials' });
          }
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  logout(): void {
    const token = localStorage.getItem('authToken') ?? '';
    localStorage.clear();
    this.http.post('/api/auth/logout', { token }).subscribe();
  }

  isAuthenticated(): boolean {
    const hasToken = localStorage.getItem('authToken') !== null;
    const expired = new Date(localStorage.getItem('sessionExpiry') ?? Date.now()-1000) < new Date();
    return  hasToken && !expired;
  }
}
