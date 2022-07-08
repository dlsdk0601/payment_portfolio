import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// react build express
const app = express();

// api express
const server = express.createServer();

const __dirname = path.resolve();

// api setting
server.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "https://paymentportfolio.herokuapp.com/",
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
app.listen(process.env.PORT || 5000, () => console.log("client success"));

// API listen
server.listen(process.env.NODE_SERVERPORTNUMBER, () =>
  console.log("server success")
);
