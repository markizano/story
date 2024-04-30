import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxPermissionsService } from 'ngx-permissions';
// import { authenticator } from '@otplib/preset-default';

enum RegistrationType {
  usernamePW = 'usernamePW',
  usernameOTP = 'usernameOTP',
  google = 'google',
  apple = 'apple',
  facebook = 'facebook',
}

/**
 * Yes, I stole this function. Cited below.
 * Generate a random string of a given length.
 * @param length {number} How many characters listed in `characters` to generate.
 * @returns {string}
 * @source https://stackoverflow.com/a/1349426/2769671
 */
function makeid(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

@Injectable()
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    QRCodeModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerType?: RegistrationType;
  RegistrationType = RegistrationType;

  // Form fields.
  username: string;
  password: string;
  vpassword: string;
  qrsecret: string;
  otpcode: string;
  valid: boolean;
  errors: string[];

  constructor(protected ngxService: NgxPermissionsService, protected http: HttpClient) {
    this.username = '';
    this.password = '';
    this.vpassword = '';
    this.qrsecret = '';
    this.otpcode = '';
    this.valid = false;
    this.errors = [];
  }

  otpUrl() {
    return `otpauth://totp/KizanoStory:${this.username}?secret=${this.qrsecret}&issuer=KizanoStory`;
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
        this.qrsecret = makeid(32);
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

  validate() {
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
  googleLogin() {

  }

  /**
   * Do the oauth dance and get the user logged in.
   */
  appleLogin() {
  }

  facebookLogin() {

  }
}
