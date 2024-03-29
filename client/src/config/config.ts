export const apiEndPoint = {
    inicisReady: "/inicis/ready",
    selectInicisData: "/inicis/select?oid=",
    kakoPayReady: "/kakao/ready",
    kakaoApprove: "/kakao/approve",
    inicisSubscriptionRead: "/subscription/ready"
};

export const url = {
    localServer: "http://localhost:5000",
    localClient: "http://localhost:3000",
    inicisJS: "https:///stdpay.inicis.com/stdjs/INIStdPay.js",
    inicisMobileJs: "https://mobile.inicis.com/smart/payment/",
    inicisSubscriptionMobile: "https://inilite.inicis.com/inibill/inibill_card.jsp"
};

export const router = {
    inicisFail: "/paymentfail",
};

export const inicisKey = {
    mid: process.env.REACT_APP_INICIS_MID ?? "INIpayTest",
    billingMid: "INIBillTst",
    mKey:
        process.env.REACT_APP_INICIS_MKEY ??
        "3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33",
    iniLiteKey: "b09LVzhuTGZVaEY1WmJoQnZzdXpRdz09",
    subscriptionBill: "BILLAUTH(Card)"
};

export const env = {
    clientUrl: process.env.REACT_APP_BASEURL ?? url.localClient,
    serverUrl: process.env.REACT_APP_BASEURL ?? url.localServer,
    mobileReturnURL:
        process.env.REACT_APP_RETURNURL_MOBILE ??
        `${url.localServer}/api/inicis/simple-mobile`,
    mobileReturnWWWRUL:
        process.env.REACT_APP_WWWRETURNURL_MOBILE ??
        "http://www.localhost:5000/api/inicis/simple-mobile",
    returnURL:
        process.env.REACT_APP_RETURNURL ?? `${url.localServer}/api/inicis/simple`,
    returnWWWURL:
        process.env.REACT_APP_WWWRETURNURL ??
        "http://www.localhost:5000/api/inicis/simple",
    closeURL: process.env.REACT_APP_CLOSEURL ?? `${url.localServer}/close-inicis`,
    closeWWWURL:
        process.env.REACT_APP_WWWCLOSEURL ??
        "http://www.localhost:5000/close-inicis",
    mobileVBankNotiUrl: `${url.localServer}/api/inicis/v-bank-mobile`,
    kakaoApproveUrlPc: `${process.env.REACT_APP_BASEURL ?? "http://localhost:5000"}/kakaopayMB-token/`,
    kakaoApproveUrlMobile: `${process.env.REACT_APP_BASEURL ?? "http://localhost:5000"}/kakaopay-token/`,
    kakaoCancelUrl: `${process.env.REACT_APP_BASEURL ?? "http://localhost:5000"}/payment-fail`,
    kakaoFailUrl: `${process.env.REACT_APP_BASEURL ?? "http://localhost:5000"}/payment-fail`,
    subscriptionMobileReturnUrl: process.env.REACT_APP_RETURNURL_MOBILE_SUNSCRIPTION ?? "http://localhost:5000/api/subscription/access-mobile",
    subscriptionMobileWWWReturnUrl: process.env.REACT_APP_RETURNURL_WWW_MOBILE_SUBSCRIPTION ?? "http://www.localhost:5000/api/inicis/access-mobile",
    subscriptionReturnUrl: process.env.REACT_APP_RETURNURL_SUNSCRIPTION ?? "http://localhost:5000/api/subscription/access",
    subscriptionWWWReturnUrl: process.env.REACT_APP_RETURNURL_SUNSCRIPTION ?? "http://www.localhost:5000/api/subscription/access",
};

export const alertText = {
    noBuyername: "주문자를 입력하세요",
    noBuyertel: "전화번호를 입력하세요",
    noBuyeremail: "이메일를 입력하세요",
    noPaymethod: "결제수단을 선택하세요",
    paymentFail: "결제에 실패하였습니다."
};

export const paymentMethod = {
    bank: "VBANK",
    subscription: "SUBSCRIPTION",
};

export const kakaoPayKey = {
    cid: "TC0ONETIME",
    partner_user_id: "partner_user_id"
};