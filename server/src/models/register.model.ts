import { Db, MongoClient } from "mongodb";
import { authenticator } from "@otplib/preset-default";

import { Config } from "../config";
import { hashPass } from "../utils";
import { RegistrationPayload, ApiResult, RegistrationType, DEFAULT_MONGO_URL, RoleType } from "../common";

export class RegistrationModel {
    config: Config;
    client: MongoClient;
    db: Db

    constructor() {
        this.config = Config.getInstance();
        this.client = new MongoClient(this.config.get('mongo')?.uri || DEFAULT_MONGO_URL);
        this.db = this.client.db('kizano_story');
    }

    close() {
        this.client.close();
    }

    validate(payload: RegistrationPayload): ApiResult {
        console.log('Registration validate function is called');
        let result = true, status = 200;
        const errors: string[] = [];
        if ( [RegistrationType.usernameOTP, RegistrationType.usernamePW].includes(payload.regType) ) {
            if ( payload.username.length < 5 ) {
                result = false;
                status = 400;
                errors.push('Username too short');
            }
            if ( payload.password.length < 8 ) {
                result = false;
                status = 400;
                errors.push('Password too short');
            }
            if ( payload.regType === RegistrationType.usernamePW ) {
                if ( payload.password !== payload.vpassword ) {
                    result = false;
                    status = 400;
                    errors.push('Passwords do not match');
                }
            }
            if (payload.regType === RegistrationType.usernameOTP) {
                if (payload.otpcode.length < 6) {
                    result = false;
                    status = 400;
                    errors.push('OTP code too short');
                }
                if (!authenticator.check(payload.otpcode, payload.otpsecret)) {
                    result = false;
                    status = 400;
                    errors.push('Invalid OTP code');
                }
            }
        }
        return { result, errors, status };
    }

    /**
     * Register a new user with the server. Pass the input through validations and cleansing.
     * @param payload {RegistrationPayload}
     * @returns {Promise<ApiResult>}
     */
    async handleRegistration(payload: RegistrationPayload): Promise<ApiResult> {
        console.log('Registration handle function is called');
        console.debug(payload);
        const result: ApiResult = this.validate(payload);
        if ( ! result.result ) {
            return result;
        }
        const users = this.db.collection('users');
        const exists = await users.findOne({ username: payload.username });
        if ( exists ) {
            return { result: false, errors: ['Username already exists'], status: 400 };
        }
        const user = {
            username: payload.username,
            password: hashPass(payload.password),
            otpsecret: payload.otpsecret,
            email: payload.email,
            role: RoleType.member,
        };
        await users.insertOne(user);
        return { result: true, errors: [], status: 200 };
    }

    /**
     * Checks to see if user exists. Useful for registration form page & front-end validations.
     * @param payload {RegistrationPayload} Something with at least {username: <string>} in it.
     * @returns {Promise<ApiResult>} TRUE if the user exists, FALSE if the user is absent.
     */
    async userExists(payload: RegistrationPayload): Promise<ApiResult> {
        console.log('User exists function is called');
        const users = this.db.collection('users');
        if ( ! payload.username || payload.username.length < 5 ) {
            return { result: false, errors: ['Username too short'], status: 200 };
        }
        if ( payload.username.length > 64 ) {
            return { result: false, errors: ['Username too long'], status: 200 };
        }
        const exists = await users.findOne({ username: payload.username });
        if ( exists ) {
            return { result: true, errors: ['Username already exists'], status: 200 };
        }
        return { result: false, errors: [], status: 200 };
    }

}
