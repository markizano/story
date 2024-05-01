import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { realpathSync as realpath } from 'fs';
import * as BodyParser from "body-parser";

import { checkOTP } from "./register";

function main() {
    dotenv.config();

    const app: Express = express();
    const port: number = parseInt( < string > process.env.PORT) || 3000;
    const host = process.env.HOST || "0.0.0.0";
    const webroot = realpath(process.env.WEBROOT || "web");

    app.use(express.static(webroot));
    app.use(BodyParser.json());

    app.get("/api", (req: Request, res: Response) => {
        res.send("Hello world");
    });

    (function(shutdown) {
        app.get('/api/shutdown', shutdown);
        app.post('/api/shutdown', shutdown);
    })((req: Request, res: Response) => {
        res.send('Shutting down...');
        console.log('Shutting down...')
        process.exit(0);
    });

    app.get('/api/verify/otp', (req: Request, res: Response) => {
        res.header("Content-Type", "application/json");
        res.status(400);
        res.send({
            result: false,
            message: "No OTP provided"
        });
    });
    app.post("/api/verify/otp", (req: Request, res: Response) => {
        const otp = req.body.otpcode;
        const secret = req.body.secret;
        const result = checkOTP(otp, secret);
        res.send({
            result: result,
            message: result ? "OK" : "Invalid OTP"
        });
    });

    app.listen(port, host, () => {
        console.log(`[server]: Server is running at http://localhost:${port}`);
    });

    return 0;
}

main();
