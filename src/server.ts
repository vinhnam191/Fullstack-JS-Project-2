import express from "express";
import bodyParser from "body-parser";
import routers from "./routes";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

console.log(process.env.ENV);

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());

app.get("/", function (req: Request, res: Response) {
  res.send("Hello World!");
});
app.use("/api", routers);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
