import express from "express";

const inicisOneTime = express.Router();

inicisOneTime.get("/onetime-result", (req, res) => {
  console.log(res);

  return res.json({
    result: true,
    msg: "inicis good",
  });
});

export default inicisOneTime;
