import express from "express";

const inicisOneTime = express.Router();

inicisOneTime.get("/onetime-result", (req, res) => {
  console.log(res);
});

export default inicisOneTime;
