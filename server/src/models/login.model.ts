import { MongoClient, Db } from 'mongodb';
import { Config } from '../config';
import { ApiResult, LoginPayload, AuthenticationType, DEFAULT_MONGO_URL } from '../common';
import { hashPass } from '../utils';
import { authenticator } from '@otplib/preset-default';

export class LoginModel {
    config: Config;
    client: MongoClient;
    db: Db;

    constructor() {
        this.config = Config.getInstance();
        this.client = new MongoClient(this.config.get('mongo')?.uri || DEFAULT_MONGO_URL);
        this.db = this.client.db('kizano_story');
    }

    close() {
        this.client.close();
    }

    validateLogin(payload: LoginPayload): ApiResult {
        console.log('Login validate function is called');
        let result: boolean = true, status: number = 200;
        const errors: string[] = [];
        if ( ! payload.username ) {
            errors.push("Missing username.");
            result = false;
            status = 400;
        }
        switch(payload.loginType) {
            case AuthenticationType.usernamePW:
                if ( ! payload.password ) {
                    errors.push("Missing password.");
                    result = false;
                    status = 400;
                }
                break;
            case AuthenticationType.usernameOTP:
                if ( ! payload.otpcode ) {
                    errors.push("Missing OTP code.");
                    result = false;
                    status = 400;
                }
                break;
            default:
                errors.push("Invalid registration type.");
                result = false;
                status = 400;
            }
        return { result, errors, status };
    }

    /**
     * Pass the credentials to the model to ask the Db if user is valid.
     * @param payload {LoginPayload}
     * @returns {boolean}
     */
    async handleLogin(payload: LoginPayload): Promise<ApiResult> {
        console.log('Login handle function is called');
        const result: ApiResult = this.validateLogin(payload);
        if ( ! result.result ) {
            return result;
        }
        // Check the DB for the user.
        // If the user is found, check the password.
        let user = await this.db.collection('users').findOne({
            username: payload.username
        });
        if ( ! user ) {
            result.result = false;
            result.errors.push('User not found.');
            return result;
        }
        switch(payload.loginType) {
            case AuthenticationType.usernamePW:
                const hashedPass = hashPass(<string>payload.password, user.password.split(':').shift());
                if ( user.password !== hashedPass ) {
                    result.result = false;
                    result.errors.push('Password is incorrect.');
                }
                break;
            case AuthenticationType.usernameOTP:
                // OTP code
                if ( ! authenticator.check(<string>payload.otpcode, user.otpsecret) ) {
                    result.result = false;
                    result.errors.push('OTP code is incorrect.');
                }
                break;
            default:
                result.result = false;
                result.errors.push('Invalid login type.');
        }
        return result
    }

    /**
     * Get the users from the DB and return the results (redacting passwords and otpsecrets).
     */
    async getUsers(): Promise<any> {
        console.log('model: Get users function is called');
        const users = await this.db.collection('users').find({}).toArray();
        return users;
    }
}
