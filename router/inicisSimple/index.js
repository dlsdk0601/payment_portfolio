import express from "express";
import {
  inicisSimplePayDesktop,
  inicisSimplePayReadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
  inicisSimplePayVbankDesktop,
  inicisSimplePayVbankMobile,
} from "../../controller/inicisSimplePay/inicisSimplePayController.js";

const inicisSimplePay = express.Router();

inicisSimplePay.post("/simple", inicisSimplePayDesktop);

inicisSimplePay.post("/simple-mobile", inicisSimplePayMobile);

inicisSimplePay.post("/ready", inicisSimplePayReadyController);

inicisSimplePay.get("/select", inicisSimplePayOrderSelect);

inicisSimplePay.post("/v-bank", inicisSimplePayVbankDesktop);

inicisSimplePay.post("/v-bank-mobile", inicisSimplePayVbankMobile);

export default inicisSimplePay;
