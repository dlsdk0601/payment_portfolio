export const env = {
  baseUrl: process.env.NODE_BASEURL ?? "http://localhost:5000",
};

export const url = {
  fail: `${env.baseUrl}/payment-fail`,
  success: `${env.baseUrl}/payment-success?oid=`,
};

export const code = {
  successCodePc: "0000",
  successCodeMobile: "00",
};

export const mobileInicisKeys = {
  successStatus: "P_STATUS=00",
  oid: "P_OID",
};

export const dbQuery = {
  insertInicisPayment:
    "INSERT INTO inicis (oid, buyerName, totalPrice, goodName, buyertel, buyeremail, paymethod, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  updateInicisPayment: "UPDATE inicis set tid=?, status=? where oid=?",
  selectIncisPayment:
    "SELECT tid, buyerName, goodName, totalPrice FROM inicis where oid=",
  updateInicisPaymentMobile: "UPDATE inicis set tid=?, status=? where oid=?",
  insertInicisVBank: "INSERT INTO inicisVbank (oid) VALUES (?)",
  updateInicisVBank:
    "UPDATE inicisVbank set VACT_Name=?, VACT_BankCode=?,  vactBankName=?, VACT_Date=? where oid=?",
  updateInicisVbankPaid: "UPDATE inicis set status=? where oid=?",
};

export const responseMessage = {
  dbInsertFail: "DB insertFail",
  totalPriceFail: "totalPrice fail",
  selectDataFail: "select data fail",
};

export const inicisConst = {
  bank: "VBANK",
  paid: "PAID",
  simple: "SIMPLE",
  before: "BEFORE",
};
