import express from "express";
import inicisOneTime from "./inicisOneTime/index.js";

const api = express.Router();

api.use("/inicis", inicisOneTime);

export default api;
