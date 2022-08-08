import express from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import maria from "mysql";

const app = express();

const __dirname = path.resolve();

dotenv.config();

// dbsetting
const dbconnect = maria.createConnection({
  host: process.env.NODE_MARIA_HOST,
  port: process.env.NODE_MARIA_PORT,
  user: process.env.NODE_MARIA_USERNAME,
  password: process.env.NODE_MARIA_PASSWORD,
  database: process.env.NODE_MARIA_DBNAME,
});

// api setting
app.use(
  cors({
    origin: [
      "https://paymentportfolio.herokuapp.com",
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", api);

dbconnect.connect(() => console.log("db connect success:::::"));

// react build listen
app.listen(process.env.PORT || 5000, () => console.log("client success"));

// react build express
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
