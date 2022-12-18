import express from "express";
import inicisSubscriptionPayContrller from "../../controller/inicisSubscriptionPay/inicisSubscriptionPayContrller.js";

const api = express.Router();

api.post("/ready", inicisSubscriptionPayContrller.inicisSubscriptionReadyController);

export default api;
