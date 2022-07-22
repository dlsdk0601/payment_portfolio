import express from "express";
import {
  kakaoPayReadyController,
  kakaoPaySuccessController,
  kakaoPayApproveController,
  kakaoPaySelectOrder,
} from "../../controller/kakaoPay/kakaoPayController.js";

const kakaoPay = express.Router();

kakaoPay.post("/ready", kakaoPayReadyController);
kakaoPay.post("/approve", kakaoPayApproveController);
kakaoPay.get("/select-success", kakaoPaySuccessController);
kakaoPay.get("/select-order", kakaoPaySelectOrder);

export default kakaoPay;
