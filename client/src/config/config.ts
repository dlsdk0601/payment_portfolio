export const apiEndPoint = {
  inicisReady: "/inicis/ready",
  selectInicisData: "/inicis/select?oid=",
};

export const url = {
  localServer: "http://localhost:5000",
  localClient: "http://localhost:3000",
  inicisJS: "https:///stdpay.inicis.com/stdjs/INIStdPay.js",
  inicisMobileJs: "https://mobile.inicis.com/smart/payment/",
};

export const router = {
  inicisFail: "/paymentfail",
};

export const inicisKey = {
  mid: "INIpayTest",
  mKey: "3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33",
};

export const env = {
  clientUrl: process.env.REACT_APP_BASEURL ?? url.localClient,
  serverUrl: process.env.REACT_APP_BASEURL ?? url.localServer,
  mobileReturnURL:
    process.env.REACT_APP_RETURNURL_MOBILE ??
    `${url.localServer}/api/inicis/onetime-mobile`,
  mobileReturnWWWRUL:
    process.env.REACT_APP_WWWRETURNURL_MOBILE ??
    "http://www.localhost:5000/api/inicis/onetime-mobile",
  returnURL:
    process.env.REACT_APP_RETURNURL ?? `${url.localServer}/api/inicis/onetime`,
  returnWWWURL:
    process.env.REACT_APP_WWWRETURNURL ??
    "http://www.localhost:5000/api/inicis/onetime",
  closeURL: process.env.REACT_APP_CLOSEURL ?? `${url.localServer}/close-inicis`,
  closeWWWURL:
    process.env.REACT_APP_WWWCLOSEURL ??
    "http://www.localhost:5000/close-inicis",
};

export const alertText = {
  noBuyername: "주문자를 입력하세요",
  noBuyertel: "전화번호를 입력하세요",
  noBuyeremail: "이메일를 입력하세요",
  noPaymethod: "결제수단을 선택하세요",
};
