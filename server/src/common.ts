
export const DEFAULT_MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

export interface ApiResult {
    result: boolean;
    errors: string[];
    status: number;
}

export enum LoginType {
    usernamePW = 'usernamePW',
    usernameOTP = 'usernameOTP',
    google = 'google',
    apple = 'apple',
    facebook = 'facebook'
}

export interface LoginPayload {
    loginType: LoginType;
    username: string;
    password?: string;
    otpcode?: string;
}

export enum RegistrationType {
    usernamePW = 'usernamePW',
    usernameOTP = 'usernameOTP',
    google = 'google',
    apple = 'apple',
    facebook = 'facebook',
}

export interface RegistrationPayload {
    regType: RegistrationType;
    username: string;
    email: string;
    password: string;
    vpassword: string;
    otpcode: string;
    otpsecret: string;
}

export enum RoleType {
    guest = 'guest',
    member = 'member',
    admin = 'admin'
}

export interface iRole {
    name: string;
    type: RoleType;
}

export interface iUser {
    username: string;
    password: string;
    email: string;
    otpsecret: string;
    role: iRole;
}
