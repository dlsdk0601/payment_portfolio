import express from "express";
import path from "path";

const inicisOneTime = express.Router();
const __dirname = path.resolve();

// inicisOneTime.all("*", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header("Access-Control-Allow-Headers", "Content-Type");
//   next();
// });

inicisOneTime.get("/onetime", (req, res) => {
  console.log(res);

  // return res.redirect(`https://paymentportfolio.herokuapp.com/`);
  return res.json({
    result: true,
    msg: "success",
  });
});

inicisOneTime.post("/ready", (req, res) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  const {
    body: {
      buyername,
      buyertel,
      buyeremail,
      goodCount,
      gopaymethod,
      timeStamp,
      oid,
      totalPrice,
    },
  } = req;
  // console.log(oid);
  // if (totalPrice === 1000 * goodCount) {
  //   console.log("go there");
  //   // window.location.href = `http://localhost:3000/kakaopay`;
  //   res.writeHead(302, { Location: "http://localhost:3030" });
  //   res.end();
  //   return;
  // }
  return res.json({
    result: false,
    msg: "totalPrice fail",
  });
});

export default inicisOneTime;
