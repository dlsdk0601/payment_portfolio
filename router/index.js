import express from "express";
import inicisOneTime from "./inicisOneTime/index.js";
import test from "./test/index.js";

const api = express.Router();

api.use("/inicis", inicisOneTime);
api.use(test);

export default api;
