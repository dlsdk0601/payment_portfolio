import rp from "request-promise";
import crypto from "crypto";
import insertDBHandle from "../../db/insert.js";
import updateDBHandle from "../../db/update.js";
import selectDBHandle from "../../db/select.js";

async function inicisSimplePayMobile(req, res) {
  const {
    body: { P_STATUS, P_TID, P_REQ_URL },
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

  const inicisAccessPaymentData = inicisAccess.split("&");

  const isSuccess = inicisAccessPaymentData.some(
    (item) => item === "P_STATUS=00"
  );

  const orderNumberString = inicisAccessPaymentData.find(
    (item) => item.indexOf("P_OID") !== -1
  ); // P_OID=주문번호

  if (!orderNumberString) {
    return res.redirect(
      `${process.env.REACT_APP_BASEURL || "http://localhost:5000"}/paymentfail?`
    );
  }

  if (isSuccess) {
    const orderNumber = orderNumberString.split("=");
    const query = "UPDATE inicis set tid=?, status=? where oid=?";
    const params = [P_TID, "P", orderNumber[1]];
    const isUpdateDB = await updateDBHandle(query, params);

    if (!isUpdateDB) {
      return res.redirect(
        `${
          process.env.REACT_APP_BASEURL || "http://localhost:5000"
        }/paymentfail?`
      );
    }
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?oid=${P_TID}`
    );
  } else {
    return res.redirect(
      `${process.env.REACT_APP_BASEURL || "http://localhost:5000"}/paymentfail`
    );
  }
}

async function inicisSimplePayDesktop(req, res) {
  const {
    body: { resultCode: accessRequestResult, authToken, authUrl, mid, charset },
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

  const { resultCode: accessResult, tid, MOID } = inicisAccess;

  if (accessResult === "0000") {
    const query = "UPDATE inicis set tid=?, status=? where oid=?";
    const params = [tid, "P", MOID];
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
      }/paymentsuccess?oid=${MOID}`
    );
  } else {
    return res.redirect(
      `${process.env.REACT_APP_BASEURL || "http://localhost:5000"}/paymentfail`
    );
  }
}

async function inicisSimplePayreadyController(req, res) {
  const {
    body: { goodCount, totalPrice, buyername, oid, goodName },
  } = req;

  const query =
    "INSERT INTO inicis (oid, buyerName, totalPrice, goodName) VALUES (?, ?, ?, ?)";
  const params = [oid, buyername, totalPrice, goodName];
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

async function inicisSimplePayOrderSelect(req, res) {
  const {
    query: { oid },
  } = req;

  const query = `SELECT tid, buyerName, goodName, totalPrice FROM inicis where oid='${oid}'`;
  const selectedData = await selectDBHandle(query);

  if (!!selectedData) {
    return res.json({
      result: true,
      msg: null,
      data: {
        tid: selectedData.tid,
        buyerName: selectedData.buyerName,
        goodName: selectedData.goodName,
        totalPrice: selectedData.totalPrice,
      },
    });
  } else {
    return res.json({
      result: false,
      msg: "select data fail",
      data: null,
    });
  }
}

export {
  inicisSimplePayDesktop,
  inicisSimplePayreadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
};