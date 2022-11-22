import rp from "request-promise";
import crypto from "crypto";
import insertDBHandle from "../../db/insert.js";
import updateDBHandle from "../../db/update.js";
import selectDBHandle from "../../db/select.js";
import {
  code,
  dbQuery,
  inicisConst,
  mobileInicisKeys,
  responseMessage,
  url,
} from "../../config/config.js";

// mobile returnRUL
const inicisSimplePayMobile = async (req, res) => {
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
};

// PC returnRUL
const inicisSimplePayDesktop = async (req, res) => {
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

  const { resultCode: accessResult, tid, MOID, payMethod } = inicisAccess;

  if (accessResult !== code.successCodePc) {
    return res.redirect(url.fail);
  }

  let isUpdateDB;

  if (payMethod.toUpperCase() === inicisConst.bank) {
    const { VACT_Name, VACT_BankCode, vactBankName, VACT_Date, VACT_Num } =
      inicisAccess;
    isUpdateDB = await updateDBHandle(dbQuery.updateInicisPayment, [
      tid,
      inicisConst.before,
      MOID,
    ]);

    const isUpdateVbankDB = await updateDBHandle(dbQuery.updateInicisVBank, [
      VACT_Name,
      VACT_BankCode,
      vactBankName,
      VACT_Date,
      VACT_Num,
      MOID,
    ]);

    if (!isUpdateVbankDB) {
      return res.redirect(url.fail);
    }
  } else {
    const params = [tid, inicisConst.paid, MOID];
    isUpdateDB = await updateDBHandle(dbQuery.updateInicisPayment, params);
  }

  if (!isUpdateDB) {
    return res.redirect(url.fail);
  }

  return res.redirect(`${url.success}${MOID}`);
};

// 결제 등록 API controller
const inicisSimplePayReadyController = async (req, res) => {
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

  if (gopaymethod === "VBANK") {
    const isInsertVBank = await insertDBHandle(dbQuery.insertInicisVBank, [
      oid,
    ]);

    if (!isInsertVBank) {
      return res.json({
        result: false,
        msg: responseMessage.dbInsertFail,
      });
    }
  }

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
};

// 주문번호로 결제 내역 조회
const inicisSimplePayOrderSelect = async (req, res) => {
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
};

const inicisSimplePayVbankDesktop = async (req, res) => {
  const {
    body: { no_tid, no_oid, cd_bank, amt_input },
  } = req;

  console.log(req.body);
  // 순서대로 tid, 주문번호, 은행코드, 입금금액
  console.log("no_tid, no_oid, cd_bank, amt_input");
  console.log(no_tid, no_oid, cd_bank, amt_input);

  const isUpdateDB = await updateDBHandle(dbQuery.updateInicisVbankPaid, [
    inicisConst.paid,
    no_oid,
  ]);

  if (!isUpdateDB) {
    return res.write("FAIL");
  }

  return res.write("OK");
};

const inicisSimplePayVbankMobile = async (req, res) => {};

export {
  inicisSimplePayDesktop,
  inicisSimplePayReadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
  inicisSimplePayVbankDesktop,
};
