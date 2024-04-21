import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT) || 3000;
const host = process.env.HOST || "localhost";

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world");
});

app.listen(port, host, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
