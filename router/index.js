import express from "express";
import inicisOneTime from "./inicisOneTime/index.js";
import cors from "cors";
import test from "./test/index.js";
import dotenv from "dotenv";

const app = express();
const api = express.Router();

dotenv.config();

app.use(
  cors({
    origin: `http://localhost:${process.env.PORT || 5000}`,
    credentials: true,
  })
);

api.use("/inicis", inicisOneTime);
api.use(test);
app.use("/api", api);

app.listen(process.env.NODE_SERVERPORTNUMBER, () =>
  console.log("server success")
);

export default api;
