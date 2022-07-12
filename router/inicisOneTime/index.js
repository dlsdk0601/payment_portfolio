import express from "express";
import path from "path";

const inicisOneTime = express.Router();

inicisOneTime.post("/onetime", (req, res) => {
  console.log(req.body);

  return res.redirect(`http://localhost:5000/`);
});

inicisOneTime.post("/ready", (req, res) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  const {
    body: { goodCount, totalPrice },
  } = req;
  // console.log(oid);
  if (totalPrice === 1000 * goodCount) {
    return res.json({
      result: true,
      msg: "totalPrice success",
    });
  }
  return res.json({
    result: false,
    msg: "totalPrice fail",
  });
});

export default inicisOneTime;
