/**
 * Common types and constants and other shared stuff for all to share.
 */

import { HttpHeaders } from "@angular/common/http";

export class BaseComponent {
    valid: boolean = false;
    errors: string[] = [];
    protected _headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
}

export enum AuthenticationType {
    usernamePW = 'usernamePW',
    usernameOTP = 'usernameOTP',
    google = 'google',
    apple = 'apple',
    facebook = 'facebook',
}

export type RegistrationPayload = {
    regType: AuthenticationType;
    username: string;
    email: string;
    password: string;
    vpassword: string;
    otpsecret: string;
    otpcode: string;
}

export type ApiResult = {
    result: boolean;
    message: string;
    errors?: string[];
    status: number;
}
