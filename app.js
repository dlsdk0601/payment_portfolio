import express, { json } from "express";
import path from "path";
import api from "./router/index.js";
import cors from "cors";

// exporess
const app = express();

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

app.use(cors());

app.use("/api", api);

app.listen(port);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.get("/api/test", (req, res) => {
  console.log(res);
  return json({
    result: true,
    msg: "goood",
  });
});
