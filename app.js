import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import envConfig from "./config/env.js";

// dotenv.config();
console.log(envConfig);

// react build express
const app = express();

// api express
const server = express();

const __dirname = path.resolve();

// env 환경변수
const { host, serverPort, port, baseURL } = envConfig;
console.log(`${baseURL || "http://localhost"}:${port || 5000}`);

// api setting
server.use(
  cors({
    origin: [
      `${baseURL || "http://localhost"}:${port || 5000}`,
      `${baseURL || "http://localhost:3000"}`,
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
app.listen(port || 5000, () => console.log("client success"));

// API listen
server.listen(serverPort || 8080, () => console.log("server success"));
