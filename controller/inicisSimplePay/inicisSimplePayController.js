import rp from "request-promise";
import crypto from "crypto";
import insertDBHandle from "../../db/insert.js";
import updateDBHandle from "../../db/update.js";
import selectDBHandle from "../../db/select.js";
import {
  code,
  dbQuery, env,
  inicisConst,
  payment_bank_code,
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
    P_MID: env.inicisMKey,
    P_TID,
  };

  const inicisAccess = await rp({
    method: "POST",
    uri: P_REQ_URL,
    form: reqJSON,
    json: true,
  });

  // 문자열로 한번에 주기 때문에 분리해서 사용하기 편하게 변형한다.
  const inicisResponseData = {};

  const _ignore = inicisAccess.split("&").forEach((item) => {
    const itemSplit = item.split("=");
    inicisResponseData[itemSplit[0]] = itemSplit[1];
  });

  const { P_OID, P_TYPE, P_STATUS: isSuccess } = inicisResponseData;

  if (!isSuccess || isSuccess !== code.successCodeMobile) {
    return res.redirect(url.fail);
  }

  let isUpdateDB;

  if (P_TYPE.toUpperCase() === inicisConst.bank) {
    isUpdateDB = await updateDBHandle(dbQuery.updateInicisPaymentMobile, [
      P_TID,
      inicisConst.before,
      P_OID,
    ]);

    const { P_VACT_NUM, P_VACT_DATE, P_VACT_BANK_CODE, P_VACT_NAME } =
      inicisResponseData;

    const P_FN_NM =
      payment_bank_code.find((item) => item.id === P_VACT_BANK_CODE) ?? null;

    const isUpdateVbankDB = await updateDBHandle(dbQuery.updateInicisVBank, [
      P_VACT_NAME,
      P_VACT_BANK_CODE,
      P_FN_NM.name ?? "",
      P_VACT_DATE,
      P_VACT_NUM,
      P_OID,
    ]);

    if (!isUpdateVbankDB) {
      return res.redirect(url.fail);
    }
  } else {
    isUpdateDB = await updateDBHandle(dbQuery.updateInicisPaymentMobile, [
      P_TID,
      inicisConst.paid,
      P_OID,
    ]);
  }

  if (!isUpdateDB) {
    return res.redirect(url.fail);
  }

  return res.redirect(`${url.success}${P_OID}`);
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

  if (gopaymethod.toUpperCase() === inicisConst.bank) {
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
  let bankData;

  if (!selectedData) {
    return res.json({
      result: false,
      msg: responseMessage.selectDataFail,
      data: null,
    });
  }

  if (selectedData.paymethod === inicisConst.bank) {
    const query = `${dbQuery.selectBankData}'${oid}'`;
    bankData = await selectDBHandle(query);
  }

  return res.json({
    result: true,
    msg: null,
    data: {
      tid: selectedData.tid,
      buyerName: selectedData.buyerName,
      goodName: selectedData.goodName,
      totalPrice: selectedData.totalPrice,
      paymethod: selectedData.paymethod,
      vactBankName: bankData?.vactBankName ?? null,
      VACT_Date: bankData?.VACT_Date ?? null,
      VACT_Num: bankData?.VACT_Num ?? null,
    },
  });
};

// 무통장입금 통보 API controller PC
const inicisSimplePayVbankDesktop = async (req, res) => {
  const {
    body: { no_oid },
  } = req;
  // 순서대로 tid, 주문번호, 은행코드, 입금금액

  // console.log(req.body);
  // {
  //   len: '0623',
  //   no_tid: 'ININPGVBNKINIpayTest20221122213434623119',
  //   no_oid: '1669120387298ZJDSLXX',
  //   id_merchant: 'INIpayTest',
  //   cd_bank: '00000088',
  //   cd_deal: '00000088',
  //   dt_trans: '20221122',
  //   tm_trans: '213434',
  //   no_msgseq: '9000000582',
  //   cd_joinorg: '20000050',
  //   dt_transbase: '20221122',
  //   no_transseq: ' ',
  //   type_msg: '0200',
  //   cl_trans: '1100',
  //   cl_close: '0',
  //   cl_kor: '2',
  //   no_msgmanage: ' ',
  //   no_vacct: '56211103849740',
  //   amt_input: '1000',
  //   amt_check: '0',
  //   nm_inputbank: '__%C5%D7%BD%BA%C6%AE__',
  //   nm_input: '%C8%AB%B1%E6%B5%BF',
  //   dt_inputstd: ' ',
  //   dt_calculstd: ' ',
  //   flg_close: '0',
  //   dt_cshr: '20221122',
  //   tm_cshr: '213434',
  //   no_cshr_appl: '269022460',
  //   no_cshr_tid: 'StdpayVBNKINIpayTest20221122213317210935',
  //   no_req_tid: 'StdpayVBNKINIpayTest20221122213317210935'
  //   }

  const isUpdateDB = await updateDBHandle(dbQuery.updateInicisVbankPaid, [
    inicisConst.paid,
    no_oid,
  ]);

  if (!isUpdateDB) {
    return res.write("FAIL");
  }

  return res.write("OK");
};

// 무통장입금 통보 API controller PC
const inicisSimplePayVbankMobile = async (req, res) => {
  const {
    body: { P_OID },
  } = req;

  const isUpdateDB = await updateDBHandle(dbQuery.updateInicisVbankPaid, [
    inicisConst.paid,
    P_OID,
  ]);

  if (!isUpdateDB) {
    return res.write("FAIL");
  }

  return res.write("OK");
};

export {
  inicisSimplePayDesktop,
  inicisSimplePayReadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
  inicisSimplePayVbankDesktop,
  inicisSimplePayVbankMobile,
};
