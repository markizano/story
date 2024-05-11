import { Express, Request, Response } from "express";

import { RegistrationModel } from "../models/register.model";
import { RegistrationPayload } from "../common";

export class RegisterController {
    model: RegistrationModel;

    constructor(app: Express) {
        this.model = new RegistrationModel();
        app.get('/api/register', (req, res) => this.get_new(req, res));
        app.post('/api/register', (req, res) => this.post_new(req, res));

        app.get('/api/register/exists', (req, res) => this.get_userExists(req, res));
    }

    get_new(req: Request, res: Response) {
        res.header("Content-Type", "application/json");
        res.status(400);
        res.send({
            result: false,
            message: "Cannot GET to /api/register. Please use POST."
        });
    }

    async post_new(req: Request, res: Response): Promise<void> {
        res.header("Content-Type", "application/json");
        console.log('Register post function is called');
        console.debug(req.body);
        const payload = <RegistrationPayload>req.body;
        const result = await this.model.handleRegistration(payload);
        res.status(result.status);
        res.send(result);
    }

    /**
     * Checks to see if user exists. Useful for registration form page & front-end validations.
     * @param req {Request}
     * @param res {Response}
     */
    async get_userExists(req: Request, res: Response): Promise<void> {
        res.header("Content-Type", "application/json");
        console.log('User exists function is called');
        console.debug(req.body);
        const payload = <RegistrationPayload>req.body;
        const result = await this.model.userExists(payload);
        res.status(result.status);
        res.send(result);
    }
}
