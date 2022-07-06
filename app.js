import express, { json } from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";
import bodyParser from "body-parser";

// exporess
const app = express();

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log("success"));

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
