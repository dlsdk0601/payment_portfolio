import express from "express";
import path from "path";
import axios from "axios";
import crypto from "crypto";

const fakeDB = [];

const inicisOneTime = express.Router();

inicisOneTime.post("/onetime", async (req, res) => {
  console.log(req.body);
  const {
    body: {
      resultCode: accessRequestResult,
      authToken,
      authUrl,
      mid,
      charset,
      orderNumber,
    },
  } = req;

  if (accessRequestResult !== "0000") {
    return res.redirect(`${process.env.NODE_BASEURL}/paymentfail`);
  }

  const timestamp = Date.now();
  const reqJSON = {
    mid,
    authToken,
    timestamp,
    signature: crypto
      .createHash("sha256")
      .update(`authToken=${authToken}&timestamp=${timestamp}`)
      .digest("hex"),
    charset,
    format: "JSON",
  };

  const inicisAccess = await axios.post(`${authUrl}`, reqJSON);
  console.log("res===");
  console.log(inicisAccess.data);

  const { resultCode: accessResult } = inicisAccess;

  if (accessResult === "0000") {
    reqJSON.result = true;
    fakeDB.push(reqJSON);
    return res.redirect(
      `${process.env.NODE_BASEURL}/paymentsuccess?oid=${orderNumber}`
    );
  } else {
    reqJSON.result = false;
    fakeDB.push(reqJSON);
    return res.redirect(
      `${process.env.NODE_BASEURL}/paymentfail?oid=${orderNumber}`
    );
  }
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

inicisOneTime.get("/select-result", (req, res) => {});

export default inicisOneTime;
