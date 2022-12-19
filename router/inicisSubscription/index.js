import express from "express";
import inicisSubscriptionPayController from "../../controller/inicisSubscriptionPay/inicisSubscriptionPayController.js";

const inicisSubscriptionRouter = express.Router();

inicisSubscriptionRouter.post(
  "/ready",
  inicisSubscriptionPayController.inicisSubscriptionReadyController,
);

inicisSubscriptionRouter.post(
  "/access",
  inicisSubscriptionPayController.inicisSubscriptionPayDesktop,
);


inicisSubscriptionRouter.post(
  "/access-mobile",
  inicisSubscriptionPayController.inicisSubscriptionPayMobile,
);

export default inicisSubscriptionRouter;
