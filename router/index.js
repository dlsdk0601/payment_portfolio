import express from "express";
import inicisSimple from "./inicisSimple/index.js";
import inicisSubscription from "./inicisSubscription/index.js";
import kakaoPay from "./kakaopay/index.js";

import test from "./test/index.js";

const api = express.Router();

api.use("/inicis", inicisSimple);
api.use("/kakao", kakaoPay);
api.use("/subscription", inicisSubscription);
api.use(test);

export default api;
