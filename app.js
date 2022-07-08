import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import API_URL from "./config/env.js";

// react build express
const app = express();

// api express
const server = express();

const __dirname = path.resolve();

// env 환경변수
const { baseurl, port, apiPort } = API_URL;

// api setting
server.use(
  cors({
    origin: baseurl,
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
app.listen(port || 5000, () => console.log("client success"));

// API listen
server.listen(apiPort, () => console.log("server success"));
