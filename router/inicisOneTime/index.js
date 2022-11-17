import express from "express";
import {
  inicisSimplePayDesktop,
  inicisSimplePayreadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
} from "../../controller/inicisSimplePay/inicisSimplePayController.js";

const inicisSimplePay = express.Router();

inicisSimplePay.post("/onetime", inicisSimplePayDesktop);

inicisSimplePay.post("/onetime-mobile", inicisSimplePayMobile);

inicisSimplePay.post("/ready", inicisSimplePayreadyController);

inicisSimplePay.get("/select", inicisSimplePayOrderSelect);

export default inicisSimplePay;
