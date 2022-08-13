import rp from "request-promise";
import crypto from "crypto";
import mariaDB from "../../db/index.js";
import insertDBHandle from "../../db/insert.js";
import updateDBHandle from "../../db/update.js";

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
    const query = "UPDATE inicisReady set tid=? isSuccess=? where oid=?";
    const params = [tid, 1, MOID];
    const isUpdateDB = await updateDBHandle(query, params);

    if (!isUpdateDB) {
      return res.redirect(
        `${
          process.env.REACT_APP_BASEURL || "http://localhost:5000"
        }/paymentfail?${inicisAccess}`
      );
    }
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
    const query = "UPDATE inicisReady set tid=?, isSuccess=? where oid=?";
    const params = [tid, 1, MOID];
    const isUpdateDB = await updateDBHandle(query, params);

    if (!isUpdateDB) {
      return res.redirect(
        `${
          process.env.REACT_APP_BASEURL || "http://localhost:5000"
        }/paymentfail`
      );
    }

    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?tid=${tid}&MOID=${MOID}&buyerName=${buyerName}&goodName=${goodName}&TotPrice=${TotPrice}`
    );
  } else {
    return res.redirect(
      `${process.env.REACT_APP_BASEURL || "http://localhost:5000"}/paymentfail`
    );
  }
}

async function inicisOneTimereadyController(req, res) {
  const {
    body: { goodCount, totalPrice, buyername, oid },
  } = req;

  const query =
    "INSERT INTO inicisReady (oid, buyerName, totalPrice) VALUES (?, ?, ?)";
  const params = [oid, buyername, totalPrice];
  const isInsertDB = await insertDBHandle(query, params);

  if (!isInsertDB) {
    return res.json({
      result: false,
      msg: "DB insertFail",
    });
  }

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
