import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// react build express
const app = express();

// api express
// const server = express();

const __dirname = path.resolve();

dotenv.config();

// api setting
app.use(
  cors({
    origin: [
      "https://paymentportfolio.herokuapp.com/",
      "https://paymentportfolio.herokuapp.com:443",
      "https://paymentportfolio.herokuapp.com",
      "http://localhost:5000",
      "http://localhost:3000",
      "http://localhost:443",
    ],
    credentials: true,
  })
);

// react build listen
app.listen(process.env.PORT || 5000, () => console.log("client success"));

// react build express

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", api);

// API listen
// server.listen(8080, () => console.log("server success"));
