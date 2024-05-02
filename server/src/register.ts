import { Request, Response } from "express";
import { Db, MongoClient } from "mongodb";
import { authenticator } from "@otplib/preset-default";

import { Config } from "./config";
import { hashPass } from "./utils";

const DEFAULT_MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";

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
    password: string;
    vpassword: string;
    otpcode: string;
    otpsecret: string;
}


export class Register {
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

    get_new(req: Request, res: Response) {
        res.header("Content-Type", "application/json");
        res.status(400);
        res.send({
            result: false,
            message: "Cannot GET to /api/register. Please use POST."
        });
    }

    post_new(req: Request, res: Response) {
        res.header("Content-Type", "application/json");
        try {
            console.debug(req.body);
            const attempt = <RegistrationPayload>req.body;
            this.validate(attempt);
            this.db.collection('users').insertOne({
                username: attempt.username,
                password: hashPass(attempt.password),
                otpsecret: attempt.otpsecret
            }).then(inserted => {
                console.debug(inserted);
            });
            res.status(200);
            res.send({
                result: true,
                message: "Registration successful"
            });
        } catch (err) {
            console.error(err);
            res.status(400);
            res.send({
                result: false,
                message: err
            });
        }
    }

    protected validate(attempt: RegistrationPayload) {
        if ( [RegistrationType.usernameOTP, RegistrationType.usernamePW].includes(attempt.regType) ) {
            if ( attempt.username.length > 5 ) {
                throw new Error('Username too short');
            }
            if ( attempt.password.length < 8 ) {
                throw new Error('Password too short');
            }
            if ( attempt.regType === RegistrationType.usernamePW ) {
                if ( attempt.password !== attempt.vpassword ) {
                    throw new Error('Passwords do not match');
                }
            }
            if (attempt.regType === RegistrationType.usernameOTP) {
                if (attempt.otpcode.length < 6) {
                    throw new Error('OTP code too short');
                }
                if (!authenticator.check(attempt.otpcode, attempt.otpsecret)) {
                    throw new Error('Invalid OTP code');
                }
            }
        }
    }
}

