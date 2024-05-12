import { Component } from '@angular/core';
import { ApiResult, AuthenticationType, BaseComponent } from '../../lib/common';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'login',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
    ],
    templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent {
    authType: AuthenticationType = AuthenticationType.usernamePW;
    AuthenticationType = AuthenticationType;

    // Form fields.
    username: string;
    password: string;
    otpcode: string;

    constructor(protected http: HttpClient, protected router: Router) {
        super();
        this.username = '';
        this.password = '';
        this.otpcode = '';
        const authType = localStorage.getItem('authType') || AuthenticationType.usernamePW;
        this.authType = authType as AuthenticationType;
    }

    /**
     * Attempt to login.
     */
    login() {
        console.log('Login function is called');
        console.debug(this.username);
        const payload = {
            loginType: this.authType,
            username: this.username,
            password: this.password,
            otpcode: this.otpcode,
        };
        const r = this.http.post('/api/login', payload, {headers: this._headers})
            .subscribe({
            // Satisfy the original contract because TypeScript sucks.
            next: ((res: Object) => ((result: ApiResult) => {
                console.log('Login result');
                console.debug(result);
                if ( result.result ) {
                    // Success! Redirect to home page.
                    this.router.navigate(['/']);
                } else {
                    // Failure. Show errors.
                    console.log('Login failed');
                    this.valid = false;
                    this.errors = <string[]>result.errors;
                }
                r.unsubscribe();
            })(res as ApiResult)),
            error: (err: HttpErrorResponse) => {
                console.error('Login error');
                console.debug(err);
                this.valid = false;
                this.errors = err.error.errors;
                r.unsubscribe();
            }
        });
    }

    /**
     * Set the authentication type.
     * @param type The type to set.
     */
    setAuthType(type: AuthenticationType) {
        this.authType = type;
        localStorage.setItem('authType', type);
    }
}
