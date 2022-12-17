import dotenv from "dotenv";

dotenv.config();

export const env = {
  baseUrl: process.env.NODE_BASEURL ?? "http://localhost:5000",
  kakaoAdminKey: process.env.NODE_KAKAO_ADMINKEY ?? "kakao",
  kakaoCid: process.env.NODE_KAKAO_CID ?? "TC0ONETIME",
  inicisMKey: process.env.NODE_INICIS_MKEY ?? "INIpayTest",
};

export const url = {
  fail: `${env.baseUrl}/payment-fail`,
  success: `${env.baseUrl}/payment-success?oid=`,
  kakaoReady: "https://kapi.kakao.com/v1/payment/ready",
  kakaoApprove: "https://kapi.kakao.com/v1/payment/approve",
  kakaoFail: "/kakaopay-fail",
  kakaoApproveClient: "/kakaopay-success/",
  kakaoSuccess: "/kakaopay-success/",
};

export const code = {
  successCodePc: "0000",
  successCodeMobile: "00",
};

export const dbQuery = {
  insertInicisPayment:
    "INSERT INTO inicis (oid, buyerName, totalPrice, goodName, buyertel, buyeremail, paymethod, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  updateInicisPayment: "UPDATE inicis set tid=?, status=? where oid=?",
  selectIncisPayment:
    "SELECT tid, buyerName, goodName, totalPrice, paymethod FROM inicis where oid=",
  updateInicisPaymentMobile: "UPDATE inicis set tid=?, status=? where oid=?",
  insertInicisVBank: "INSERT INTO inicisVbank (oid) VALUES (?)",
  updateInicisVBank:
    "UPDATE inicisVbank set VACT_Name=?, VACT_BankCode=?,  vactBankName=?, VACT_Date=?, VACT_Num=? where oid=?",
  updateInicisVbankPaid: "UPDATE inicis set status=? where oid=?",
  selectBankData:
    "SELECT vactBankName, VACT_Date, VACT_Num FROM inicisVbank where oid=",
  insertKakaoPay: "INSERT INTO kakaoPay (tid, oid, goodName, totalPrice, buyerName, partner_user_id) VALUES(?, ?, ? ,?, ?, ?)",
  selectKakaoPay: "SELECT tid, partner_user_id FROM kakaoPay where oid=",
  updateKakaoPay: "UPDATE kakaoPay set status=? where tid=?",
  selectKakaoPaySuccess: "SELECT oid, status FROM kakaoPay where tid=",
  selectKakaoPayResult: "SELECT tid, oid, goodName, totalPrice, buyerName, status FROM kakaoPay where oid=",
};

export const responseMessage = {
  dbInsertFail: "DB insertFail",
  totalPriceFail: "totalPrice fail",
  selectDataFail: "select data fail",
  kakaoPayTotalPriceError: "kakaoPay Ready API fail",
  kakaoApiError: "kakaoPay Ready API fail",
  kakaoApproveError: "apprive faile",
  kakaoApprove: "approve success",
  kakaoTidError: "There is not Tid",
  kakaoPayError: "Pay fail",
};

export const inicisConst = {
  bank: "VBANK",
  paid: "PAID",
  simple: "SIMPLE",
  before: "BEFORE",
  ing: "ING",
  fail: "FAIL",
  ok: "OK",
};

export const kakaoPayConst = {
  paid: "PAID",
  before: "BEFORE",
};

export const payment_bank_code = [
  { id: "11", name: "농협중앙회" },
  { id: "12", name: "단위농협" },
  { id: "16", name: "축협중앙회" },
  { id: "20", name: "우리은행" },
  { id: "21", name: "구)조흥은행" },
  { id: "22", name: "상업은행" },
  { id: "23", name: "SC제일은행" },
  { id: "24", name: "한일은행" },
  { id: "25", name: "서울은행" },
  { id: "26", name: "구)신한은행" },
  { id: "27", name: "한국씨티은행" },
  { id: "31", name: "대구은행" },
  { id: "32", name: "부산은행" },
  { id: "34", name: "광주은행" },
  { id: "35", name: "제주은행" },
  { id: "37", name: "전북은행" },
  { id: "38", name: "강원은행" },
  { id: "39", name: "경남은행" },
  { id: "41", name: "비씨카드" },
  { id: "45", name: "새마을금고" },
  { id: "48", name: "신용협동조합중앙회" },
  { id: "50", name: "상호저축은행" },
  { id: "53", name: "한국씨티은행" },
  { id: "54", name: "홍콩상하이은행" },
  { id: "55", name: "도이치은행" },
  { id: "56", name: "ABN암로" },
  { id: "57", name: "JP모건" },
  { id: "59", name: "미쓰비시도쿄은행" },
  { id: "60", name: "BOA(Bank of America)" },
  { id: "64", name: "산림조합" },
  { id: "70", name: "신안상호저축은행" },
  { id: "71", name: "우체국" },
  { id: "81", name: "하나은행" },
  { id: "83", name: "평화은행" },
  { id: "87", name: "신세계" },
  { id: "88", name: "신한(통합)은행" },
  { id: "89", name: "케이뱅크" },
  { id: "90", name: "카카오뱅크" },
  { id: "91", name: "네이버포인트" },
  { id: "92", name: "토스뱅크" },
  { id: "93", name: "토스머니" },
  { id: "94", name: "SSG머니" },
  { id: "96", name: "엘포인트" },
  { id: "97", name: "카카오 머니" },
  { id: "98", name: "페이코" },
  { id: "02", name: "한국산업은행" },
  { id: "03", name: "기업은행" },
  { id: "04", name: "국민은행" },
  { id: "05", name: "하나은행" },
  { id: "06", name: "국민은행" },
  { id: "07", name: "수협중앙회" },
  { id: "D1", name: "유안타증권" },
  { id: "D2", name: "현대증권" },
  { id: "D3", name: "미래에셋증권" },
  { id: "D4", name: "한국투자증권" },
  { id: "D5", name: "우리투자증권" },
  { id: "D6", name: "하이투자증권" },
  { id: "D7", name: "HMC투자증권" },
  { id: "D8", name: "SK증권" },
  { id: "D9", name: "대신증권" },
  { id: "DA", name: "하나대투증권" },
  { id: "DB", name: "굿모닝신한증권" },
  { id: "DC", name: "동부증권" },
  { id: "DD", name: "유진투자증권" },
  { id: "DE", name: "메리츠증권" },
  { id: "DF", name: "신영증권" },
  { id: "DG", name: "대우증권" },
  { id: "DH", name: "삼성증권" },
  { id: "DI", name: "교보증권" },
  { id: "DJ", name: "키움증권" },
  { id: "DK", name: "이트레이드" },
  { id: "DL", name: "솔로몬증권" },
  { id: "DM", name: "한화증권" },
  { id: "DN", name: "NH증권" },
  { id: "DO", name: "부국증권" },
  { id: "DP", name: "LIG증권" },
  { id: "BW", name: "뱅크월렛" },
];
