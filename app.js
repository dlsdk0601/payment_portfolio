import express from "express";
import path from "path";
import api from "./router/index.js";

// exporess
const app = express();

const __dirname = path.resolve();
const port = process.env.PORT || 5000;

app.use("/api", api);

app.listen(port);

app.use(express.static(path.join(__dirname, "/client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.get("/api/test", (req, res) => {
  console.log(res);
});
