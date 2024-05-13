import express, { Express } from "express";
import dotenv from "dotenv";
import { realpathSync as realpath } from 'fs';
import * as BodyParser from "body-parser";
import session from 'express-session'
const MongoDBStore = require('connect-mongodb-session')(session);

import { routeApp } from "./routes";
import { Config } from "./config";

/**
 * Take the edge off of reading the environment.
 * Store all values one would search in the environment in this class to collate the data.
 */
export class EnvConfig {
    port: number;
    host: string;
    webroot: string;
    trustProxy: boolean;
    sessionSecret: string;
    mongoUri: string;

    constructor(env: NodeJS.ProcessEnv) {
        const config = Config.getInstance();
        this.port = parseInt( <string>process.env.PORT) || config.get('port') || 3000;
        this.host = env.HOST || config.get('host') || "0.0.0.0";
        this.webroot = realpath(env.WEBROOT || config.get('webroot') || 'web');
        this.trustProxy = !!env.TRUST_PROXY || config.get('trustProxy') || false;
        this.sessionSecret = env.SESSION_SECRET || config.get('sessionSecret') || 'specialsecretsauce';
        this.mongoUri = env.MONGO_URI || config.get('mongo')?.uri || 'mongodb://localhost:27017';
    }
}

export function main() {
    dotenv.config();

    const app: Express = express();
    const cfg: EnvConfig = new EnvConfig(process.env);
    const store = new MongoDBStore({uri: cfg.mongoUri, collection: 'sessions'}, (err: any) => { if (err) console.log(`Err connecting: ${err}`) });

    app.use(express.static(cfg.webroot));
    app.use(BodyParser.json());
    cfg.trustProxy && app.set( 'trust proxy', 1);
    app.use(session({
        secret: cfg.sessionSecret,
        resave: false,
        saveUninitialized: true,
        store: store,
        cookie: { secure: true }
    }));
    routeApp(app);

    app.listen(cfg.port, cfg.host, () => {
        console.log(`[server]: Server is running at http://${cfg.host}:${cfg.port}`);
    });

    return 0;
}

if ( require.main === module ) main();
