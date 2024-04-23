import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { realpathSync as realpath } from 'fs';

function main() {
  dotenv.config();

  const app: Express = express();
  const port: number = parseInt(<string>process.env.PORT) || 3000;
  const host = process.env.HOST || "localhost";
  const webroot = realpath(process.env.WEBROOT || "web");

  app.use(express.static(webroot));
  app.get("/api", (req: Request, res: Response) => {
    res.send("Hello world");
  });

  app.listen(port, host, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return 0;
}

main();
