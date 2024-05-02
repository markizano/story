import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { realpathSync as realpath } from 'fs';
import * as BodyParser from "body-parser";

import { routeApp } from "./routes";

export function main() {
    dotenv.config();

    const app: Express = express();
    const port: number = parseInt( < string > process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";
    const webroot = realpath(process.env.WEBROOT || "web");

    app.use(express.static(webroot));
    app.use(BodyParser.json());
    routeApp(app);

    app.listen(port, host, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    return 0;
}

if ( require.main === module ) main();
