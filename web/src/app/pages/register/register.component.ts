import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClient, HttpClientModule } from '@angular/common/http';
// @ts-ignore
import { authenticator } from '@otplib/preset-browser';

import { RegistrationType, ApiVerifyResult } from '../../lib/common';

@Injectable()
@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        QRCodeModule,
        HttpClientModule,
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
    qrsecret: string;
    otpcode: string;
    valid: boolean;
    otpvalid?: boolean;
    errors: string[];

    constructor(protected http: HttpClient) {
        this.username = '';
        this.email = '';
        this.password = '';
        this.vpassword = '';
        this.qrsecret = '';
        this.otpcode = '';
        this.valid = false;
        this.errors = [];
    }

    otpUrl(): string {
        return authenticator.keyuri(encodeURIComponent(this.username), 'KizanoStory', this.qrsecret);
    }

    genSecret() {
        this.qrsecret = authenticator.generateSecret();
    }

    /**
     * Check the OTP code for validity right here in the browser.
     */
    checkOTP() {
        if (this.otpcode.length < 6) {
            this.otpvalid = false;
            return;
        }
        if ( authenticator.check(this.otpcode, this.qrsecret) ) {
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
                this.qrsecret = authenticator.generateSecret();
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
                // if (!authenticator.check(this.otpcode, this.qrsecret)) {
                //   this.errors.push('Invalid OTP code.');
                //   this.valid = false;
                // }
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
            qrsecret: this.qrsecret,
            otpcode: this.otpcode,
        };
        console.log(payload);
        // Send the payload to the server.
        const r = this.http.post('/api/register', payload).subscribe((response) => {
            console.log(response);
            r.unsubscribe();
        });
    }

    /**
     * Do the oauth dance and get the user logged in.
     */
    googleLogin() { }
    appleLogin() { }
    facebookLogin() { }
}
