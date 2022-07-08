import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

// react build express
const app = express();

// api express
const server = express();

const __dirname = path.resolve();

// env 환경변수

// api setting
server.use(
  cors({
    origin: [
      "https://paymentportfolio.herokuapp.com/",
      "https://paymentportfolio.herokuapp.com:443",
      "https://paymentportfolio.herokuapp.com",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use("/api", api);

// react build express

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

// react build listen
app.listen(process.env.NODE_PORT || 5000, () => console.log("client success"));

// API listen
server.listen(8080, () => console.log("server success"));
