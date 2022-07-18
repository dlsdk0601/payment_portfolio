import express from "express";
import {
  inicisOntimeController,
  inicisOneTimereadyController,
  selectResultController,
} from "../../controller/inicisOnetime/inicisOneTimeController.js";

const inicisOneTime = express.Router();

inicisOneTime.post("/onetime", inicisOntimeController);

inicisOneTime.post("/ready", inicisOneTimereadyController);

inicisOneTime.get("/select-result", selectResultController);

export default inicisOneTime;
