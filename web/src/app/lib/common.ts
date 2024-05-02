/**
 * Common types and constants and other shared stuff for all to share.
 */

export enum RegistrationType {
    usernamePW = 'usernamePW',
    usernameOTP = 'usernameOTP',
    google = 'google',
    apple = 'apple',
    facebook = 'facebook',
}

export interface ApiResult {
    result: boolean;
    message: string;
}
