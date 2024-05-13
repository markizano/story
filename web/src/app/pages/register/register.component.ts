import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

/*
  For the OTP authenticator stuff, ignore what TS has to say. The original libraries are included
  in the browser. The compiled result will end up using those.
*/
// @ts-ignore
import { authenticator } from '@otplib/preset-browser';

import { AuthenticationType, ApiResult, BaseComponent } from '../../lib/common';

@Injectable()
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        QRCodeModule,
        HttpClientModule,
        RouterModule,
    ],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
})
export class RegisterComponent extends BaseComponent {
    registerType?: AuthenticationType;
    RegistrationType = AuthenticationType;

    // Form fields.
    username: string;
    email: string;
    password: string;
    vpassword: string;
    otpsecret: string;
    otpcode: string;
    otpvalid?: boolean;

    constructor(protected http: HttpClient, protected router: Router) {
        super();
        this.username = '';
        this.email = '';
        this.password = '';
        this.vpassword = '';
        this.otpsecret = '';
        this.otpcode = '';
        this.valid = false;
        this.errors = [];
    }

    otpUrl(): string {
        return authenticator.keyuri(encodeURIComponent(this.username), 'KizanoStory', this.otpsecret);
    }

    genSecret() {
        this.otpsecret = authenticator.generateSecret();
    }

    /**
     * Check the OTP code for validity right here in the browser.
     */
    checkOTP() {
        if (this.otpcode.length < 6) {
            this.otpvalid = false;
            return;
        }
        if ( authenticator.check(this.otpcode, this.otpsecret) ) {
            this.otpvalid = true;
        } else {
            this.otpvalid = false;
        }
    }

    setRegistrationType(type: AuthenticationType) {
        this.registerType = type;
        switch (type) {
            case AuthenticationType.usernamePW:
                this.username = '';
                this.password = '';
                this.vpassword = '';
                break;
            case AuthenticationType.usernameOTP:
                this.username = '';
                this.otpsecret = authenticator.generateSecret();
                this.otpcode = '';
                break;
            case AuthenticationType.google:
                break;
            case AuthenticationType.apple:
                break;
            case AuthenticationType.facebook:
                break;
        }
    }

    validate(): boolean {
        this.valid = true;
        this.errors = [];
        switch (this.registerType) {
            case AuthenticationType.usernamePW:
                // Register with username and password.
                if (this.username.length < 5) {
                    this.errors.push('Username must be at least 5 characters.');
                    this.valid = false;
                }
                if (this.password.length < 8) {
                    this.errors.push('Password must be at least 8 characters.');
                    this.valid = false;
                }
                if ( this.password != this.vpassword ) {
                    this.errors.push('Passwords do not match.');
                    this.valid = false;
                }
                break;
            case AuthenticationType.usernameOTP:
                // Register with username and OTP.
                if (this.username.length < 5) {
                    this.errors.push('Username must be at least 5 characters.');
                    this.valid = false;
                }
                if (this.otpcode.length < 6) {
                    this.errors.push('OTP code must be 6 characters.');
                    this.valid = false;
                }
                this.checkOTP();
                if ( !this.otpvalid ) {
                  this.errors.push('Invalid OTP code.');
                  this.valid = false;
                }
                break;
            case AuthenticationType.google:
                // Register with google.
                break;
            case AuthenticationType.apple:
                // Register with apple.
                break;
            case AuthenticationType.facebook:
                // Register with facebook.
                break;
        }
        return this.valid;
    }

    /**
     * Validate the form and register the user with the server.
     */
    register() {
        this.validate();
        let payload = {
            regType: this.registerType,
            username: this.username,
            password: this.password,
            email: this.email,
            otpsecret: this.otpsecret,
            otpcode: this.otpcode,
        };
        console.log(payload);
        // Send the payload to the server.
        const r = this.http.post('/api/register', payload, {headers: this._headers}).subscribe({
            next: (res) => ((response: ApiResult) => {
                if ( response.result ) {
                    // Registration was successful.
                    // Redirect to the login page.
                    this.router.navigate(['/login']);
                } else {
                    // Registration failed.
                    // Show the error message.
                    this.valid = false;
                    this.errors.push(response.message);
                }
            })(res as ApiResult),
            error: (err: HttpErrorResponse) => {
                console.log(err);
                this.valid = false;
                this.errors = err.error.errors;
            }
        });
    }

    /**
     * Do the oauth dance and get the user logged in.
     */
    googleLogin() { }
    appleLogin() { }
    facebookLogin() { }
}
