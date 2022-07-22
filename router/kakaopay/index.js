import express from "express";
import {
  kakaoPayReadyController,
  kakaoPayReadySuccess,
} from "../../controller/kakaoPay/kakaoPayController.js";

const kakaoPay = express.Router();

kakaoPay.post("/ready", kakaoPayReadyController);
kakaoPay.get("/ready-isSuccess", kakaoPayReadySuccess);

export default kakaoPay;
