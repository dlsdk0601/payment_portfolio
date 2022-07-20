import express from "express";
import {
  inicisOneTimeDesktop,
  inicisOneTimereadyController,
  selectResultController,
  inicisOneTimeMobile,
} from "../../controller/inicisOnetime/inicisOneTimeController.js";

const inicisOneTime = express.Router();

inicisOneTime.post("/onetime", inicisOneTimeDesktop);

inicisOneTime.post("/onetime-mobile", inicisOneTimeMobile);

inicisOneTime.post("/ready", inicisOneTimereadyController);

inicisOneTime.get("/select-result", selectResultController);

export default inicisOneTime;
