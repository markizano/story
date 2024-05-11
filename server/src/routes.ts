import { Express, Request, Response } from "express";

import { RegisterController } from "./controllers/register.controller";
import { LoginController } from "./controllers/login.controller";

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
    
    const controllers = [
        new RegisterController(app),
        new LoginController(app)
    ]

    return app;
}
