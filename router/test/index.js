import express from "express";

const test = express.Router();

test.get("/test", (req, res) => {
  return res.json({
    result: true,
    msg: "success",
  });
});

export default test;
