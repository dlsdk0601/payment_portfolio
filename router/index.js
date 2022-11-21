import express from "express";
import inicisOneTime from "./inicisSimple/index.js";
import kakaoPay from "./kakaopay/index.js";
import test from "./test/index.js";

const api = express.Router();

api.use("/inicis", inicisOneTime);
api.use("/kakao", kakaoPay);
api.use(test);

export default api;
