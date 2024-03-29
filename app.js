import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import api from "./router/index.js";
import mariaDB from "./db/index.js";
import { env } from "./config/config.js";

const app = express();

const __dirname = path.resolve();

dotenv.config();

// api setting
app.use(
  cors({
    origin: [
      "https://paymentportfolio.herokuapp.com",
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", api);


// react build express
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

// react build listen and DB connect
mariaDB.connect(() => {
  app.listen(process.env.PORT || 5000, () => console.log(`client success:::::::::${env.baseUrl}`));
});
