import { Express, Request, Response } from "express";

import { Register } from "./register";

export function routeApp(app: Express) {
    app.get("/api", (req: Request, res: Response) => {
        res.send("Hello world");
    });
    const registration = new Register();
    const shutdown = (req: Request, res: Response) => {
        res.send('Shutting down...');
        console.log('Shutting down...')
        process.exit(0);
    };

    app.get('/api/shutdown', shutdown);
    app.post('/api/shutdown', shutdown);

    app.get('/api/register', registration.get_new);
    app.post('/api/register', registration.post_new);

    return app;
}


