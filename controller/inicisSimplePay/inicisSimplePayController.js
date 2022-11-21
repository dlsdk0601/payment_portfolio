import rp from "request-promise";
import crypto from "crypto";
import insertDBHandle from "../../db/insert.js";
import updateDBHandle from "../../db/update.js";
import selectDBHandle from "../../db/select.js";
import {
  code,
  dbQuery,
  mobileInicisKeys,
  responseMessage,
  url,
} from "../../config/config.js";

async function inicisSimplePayMobile(req, res) {
  const {
    body: { P_STATUS, P_TID, P_REQ_URL },
  } = req;

  if (P_STATUS !== code.successCodeMobile) {
    return res.redirect(url.fail);
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
    (item) => item === mobileInicisKeys.successStatus
  );

  // P_OID=주문번호
  const orderNumberString = inicisAccessPaymentData.find((item) =>
    item.includes(mobileInicisKeys.oid)
  );

  if (!orderNumberString || !isSuccess) {
    return res.redirect(url.fail);
  }

  const orderNumber = orderNumberString.split("=")[1];
  const params = [P_TID, "PAID", orderNumber];
  const isUpdateDB = await updateDBHandle(
    dbQuery.updateInicisPaymentMobile,
    params
  );

  if (!isUpdateDB) {
    return res.redirect(url.fail);
  }

  return res.redirect(`${url.success}${orderNumber}`);
}

async function inicisSimplePayDesktop(req, res) {
  const {
    body: { resultCode: accessRequestResult, authToken, authUrl, mid, charset },
  } = req;

  if (accessRequestResult !== code.successCodePc) {
    return res.redirect(url.fail);
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

  if (accessResult !== code.successCodePc) {
    return res.redirect(url.fail);
  }

  const params = [tid, "PAID", MOID];
  const isUpdateDB = await updateDBHandle(dbQuery.updateInicisPayment, params);

  if (!isUpdateDB) {
    return res.redirect(url.fail);
  }

  return res.redirect(`${url.success}${MOID}`);
}

async function inicisSimplePayReadyController(req, res) {
  const {
    body: {
      goodCount,
      totalPrice,
      buyername,
      oid,
      goodName,
      buyertel,
      buyeremail,
      gopaymethod,
    },
  } = req;

  const params = [
    oid,
    buyername,
    totalPrice,
    goodName,
    buyertel,
    buyeremail,
    gopaymethod,
    "SIMPLE",
  ];

  const isInsertDB = await insertDBHandle(dbQuery.insertInicisPayment, params);

  if (!isInsertDB) {
    return res.json({
      result: false,
      msg: responseMessage.dbInsertFail,
    });
  }

  if (totalPrice !== 1000 * goodCount) {
    return res.json({
      result: false,
      msg: responseMessage.totalPriceFail,
    });
  }

  return res.json({
    result: true,
    msg: null,
  });
}

async function inicisSimplePayOrderSelect(req, res) {
  const {
    query: { oid },
  } = req;

  const query = `${dbQuery.selectIncisPayment}'${oid}'`;
  const selectedData = await selectDBHandle(query);

  if (!selectedData) {
    return res.json({
      result: false,
      msg: responseMessage.selectDataFail,
      data: null,
    });
  }

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
}

export {
  inicisSimplePayDesktop,
  inicisSimplePayReadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
};
