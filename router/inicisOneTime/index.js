import express from "express";
import {
  inicisOneTimeDesktop,
  inicisOneTimereadyController,
  inicisOneTimeMobile,
  inicisOneTimeOrderSelect,
} from "../../controller/inicisOnetime/inicisOneTimeController.js";

const inicisOneTime = express.Router();

inicisOneTime.post("/onetime", inicisOneTimeDesktop);

inicisOneTime.post("/onetime-mobile", inicisOneTimeMobile);

inicisOneTime.post("/ready", inicisOneTimereadyController);

inicisOneTime.get("/select", inicisOneTimeOrderSelect);

export default inicisOneTime;
