import rp from "request-promise";
import crypto from "crypto";
import maria from "mysql";

const mariaDB = maria.createConnection({
  host: process.env.NODE_MARIA_HOST,
  port: process.env.NODE_MARIA_PORT,
  user: process.env.NODE_MARIA_USERNAME,
  password: process.env.NODE_MARIA_PASSWORD,
  database: process.env.NODE_MARIA_DBNAME,
});

async function inicisOneTimeMobile(req, res) {
  const {
    body: { P_STATUS, P_RMESG1, P_TID, P_AMT, P_REQ_URL, P_NOTI },
  } = req;

  if (P_STATUS !== "00") {
    return res.redirect(`${process.env.NODE_BASEURL}/paymentfail`);
  }

  const reqJSON = {
    P_MID: "INIpayTest",
    P_TID,
  };

  const inicisAccess = await rp({
    method: "POST",
    uri: P_REQ_URL,
    form: reqJSON,
    json: true,
  });

  const arr = inicisAccess.split("&");
  const isSuccess = arr.some((item) => item === "P_STATUS=00");

  if (isSuccess) {
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?${inicisAccess}`
    );
  } else {
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail?${inicisAccess}`
    );
  }
}

async function inicisOneTimeDesktop(req, res) {
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

  const inicisAccess = await rp({
    method: "POST",
    uri: authUrl,
    form: reqJSON,
    json: true,
  });

  const {
    resultCode: accessResult,
    tid,
    MOID,
    buyerName,
    goodName,
    TotPrice,
  } = inicisAccess;

  if (accessResult === "0000") {
    mariaDB.query(
      `INSERT INTO inicisReady(tid, oid, buyerName, goodName, totalPrice) VALUES(?, ?, ?, ?)`,
      [tid, MOID, buyerName, goodName, TotPrice]
    );
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?tid=${tid}&MOID=${MOID}&buyerName=${buyerName}&goodName=${goodName}&TotPrice=${TotPrice}`
    );
  } else {
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail?tid=${tid}&MOID=${MOID}&buyerName=${buyerName}&goodName=${goodName}&TotPrice=${TotPrice}`
    );
  }
}

function inicisOneTimereadyController(req, res) {
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
}

export {
  inicisOneTimeDesktop,
  inicisOneTimereadyController,
  inicisOneTimeMobile,
};
