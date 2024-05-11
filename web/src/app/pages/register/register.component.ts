import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

/*
  For the OTP authenticator stuff, ignore what TS has to say. The original libraries are included
  in the browser. The compiled result will end up using those.
*/
// @ts-ignore
import { authenticator } from '@otplib/preset-browser';

import { RegistrationType, ApiResult } from '../../lib/common';

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
export class RegisterComponent {
    registerType?: RegistrationType;
    RegistrationType = RegistrationType;

    // Form fields.
    username: string;
    email: string;
    password: string;
    vpassword: string;
    otpsecret: string;
    otpcode: string;
    valid: boolean;
    otpvalid?: boolean;
    errors: string[];

    protected _headers: HttpHeaders;

    constructor(protected http: HttpClient, protected router: Router) {
        this.username = '';
        this.email = '';
        this.password = '';
        this.vpassword = '';
        this.otpsecret = '';
        this.otpcode = '';
        this.valid = false;
        this.errors = [];
        this._headers = new HttpHeaders({ 'Content-Type': 'application/json' });
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

    setRegistrationType(type: RegistrationType) {
        this.registerType = type;
        switch (type) {
            case RegistrationType.usernamePW:
                this.username = '';
                this.password = '';
                this.vpassword = '';
                break;
            case RegistrationType.usernameOTP:
                this.username = '';
                this.otpsecret = authenticator.generateSecret();
                this.otpcode = '';
                break;
            case RegistrationType.google:
                break;
            case RegistrationType.apple:
                break;
            case RegistrationType.facebook:
                break;
        }
    }

    validate(): boolean {
        this.valid = true;
        this.errors = [];
        switch (this.registerType) {
            case RegistrationType.usernamePW:
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
            case RegistrationType.usernameOTP:
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
            case RegistrationType.google:
                // Register with google.
                break;
            case RegistrationType.apple:
                // Register with apple.
                break;
            case RegistrationType.facebook:
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
            otpsecret: this.otpsecret,
            otpcode: this.otpcode,
        };
        console.log(payload);
        // Send the payload to the server.
        const r = this.http.post('/api/register', payload, {headers: this._headers}).subscribe((res) => {
            console.log(res);
            r.unsubscribe();
            const response = <ApiResult>res;
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
        });
    }

    /**
     * Do the oauth dance and get the user logged in.
     */
    googleLogin() { }
    appleLogin() { }
    facebookLogin() { }
}
