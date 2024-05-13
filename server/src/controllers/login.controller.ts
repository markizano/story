import { Express, Request, Response } from "express";

import { LoginPayload } from "../common";
import { LoginModel } from "../models/login.model";
import { BaseController } from "./base.controller";
import { AppMode } from "../config";

export class LoginController extends BaseController {
    model: LoginModel;

    constructor(app: Express) {
        super();
        console.log('Login class is created');
        this.model = new LoginModel();
        app.get('/api/login', (req, res) => this.get_login(req, res));
        app.post('/api/login', (req, res) => this.post_login(req, res));

        if ( this.config.get('mode') == AppMode.DEV ) {
            app.get('/api/users', (req, res) => this.get_users(req, res));
        }
    }
    
    /**
     * Fail a GET request at /api/login.
     */
    get_login(req: Request, res: Response): void {
        console.log('Login function is called');
        res.header("Content-Type", "application/json");
        res.status(400);
        res.send({
            result: false,
            message: "Cannot GET to /api/login. Please use POST."
        });
    }

    /**
     * Handle the post-login function from ExpressJS.
     * Take the user input and pass to validation functions to ensure the form is valid.
     * Pass the valid credentials to the model to ask the DB if the user exists and login correct.
     * Based on the results of this, send the correct headers back to the client along with the
     * payload response.
     * @param req {Request} ExpressJS Request.
     * @param res {Response} ExpressJS Response.
     * @returns {void}
     */
    async post_login(req: Request, res: Response): Promise<void> {
        console.log('Login post function is called');
        res.header("Content-Type", "application/json");
        const payload: LoginPayload = req.body;
        const loginResult = await this.model.handleLogin(payload);
        res.status(loginResult.result? 200: 400);
        res.send(loginResult);
    }

    /**
     * Get the users from the DB and return the results (redacting passwords and otpsecrets).
     */
    async get_users(req: Request, res: Response): Promise<void> {
        console.log('controller: Get users function is called');
        res.header("Content-Type", "application/json");
        const users = await this.model.getUsers();
        res.status(200);
        res.send(users);
        console.log('Users:', users);
    }
}
