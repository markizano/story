import { Express, Request, Response } from "express";

import { Register } from "./register";

export function routeApp(app: Express) {
    app.get("/api", (req: Request, res: Response) => {
        res.send("Hello world");
    });
    const shutdown = (req: Request, res: Response) => {
        res.send('Shutting down...');
        console.log('Shutting down...')
        process.exit(0);
    };
    
    app.get('/api/shutdown', shutdown);
    app.post('/api/shutdown', shutdown);
    
    const registration = new Register();
    app.get('/api/register', (req, res) => registration.get_new(req, res));
    app.post('/api/register', (req, res) => registration.post_new(req, res));

    return app;
}


