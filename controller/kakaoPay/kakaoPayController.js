import rp from "request-promise";
import dotenv from "dotenv";

dotenv.config();

const fakeReadyDB = [];
const fakeSuccessDB = [];

async function kakaoPayReadyController(req, res) {
  const { body } = req;

  console.log("fakeReadyDB==1");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==1");
  console.log(fakeSuccessDB);

  const { quantity, total_amount } = body;
  if (quantity * 1000 !== total_amount) {
    return res.json({ result: false, msg: "kakaoPay Ready API fail" });
  }

  const kakaoReady = await rp({
    method: "POST",
    uri: "https://kapi.kakao.com/v1/payment/ready",
    form: {
      ...body,
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NODE_KAKAO_ADMINKEY}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const { tid, next_redirect_mobile_url, next_redirect_pc_url } =
    JSON.parse(kakaoReady);

  if (!tid) {
    return res.json({ result: false, msg: "kakaoPay Ready API fail" });
  }

  const fakeData = { ...JSON.parse(kakaoReady), ...body };
  fakeReadyDB.push(fakeData);
  console.log("fakeReadyDB==2");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==2");
  console.log(fakeSuccessDB);

  return res.json({
    result: true,
    msg: null,
    tid,
    next_redirect_mobile_url,
    next_redirect_pc_url,
  });
}

async function kakaoPayApproveController(req, res) {
  const {
    body: { pg_token, oid },
  } = req;

  console.log("fakeReadyDB==3");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==3");
  console.log(fakeSuccessDB);

  const selectData = fakeReadyDB.find((item) => item.partner_order_id === oid);

  if (!selectData) {
    return res.json({
      result: true,
      msg: "approve fail",
    });
  }

  const kakaoReady = await rp({
    method: "POST",
    uri: "https://kapi.kakao.com/v1/payment/approve",
    form: {
      cid: "TC0ONETIME",
      tid: selectData.tid,
      partner_order_id: selectData.partner_order_id,
      partner_user_id: selectData.partner_user_id,
      pg_token,
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NODE_KAKAO_ADMINKEY}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  console.log("fakeReadyDB==4");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==4");
  console.log(fakeSuccessDB);

  if (!!kakaoReady) {
    fakeSuccessDB.push(JSON.parse(kakaoReady));
    return res.json({
      result: true,
      msg: "approve success",
    });
  } else {
    return res.json({
      result: true,
      msg: "approve fail",
    });
  }
}

async function kakaoPaySuccessController(req, res) {
  const {
    query: { tid },
  } = req;

  console.log("fakeReadyDB==5");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==5");
  console.log(fakeSuccessDB);

  const isReadySuccess = fakeSuccessDB.find((item) => item.tid === tid);

  if (!!isReadySuccess) {
    return res.json({
      result: true,
      msg: null,
      kakaoPayApproveUrl: `/kakaopay-success/${isReadySuccess.partner_order_id}`,
    });
  } else {
    return res.json({
      result: true,
      msg: "there is not Tid",
      kakaoPayApproveUrl: `/kakaopay-fail`,
    });
  }
}

async function kakaoPaySelectOrder(req, res) {
  const {
    query: { oid },
  } = req;

  console.log("fakeReadyDB==6");
  console.log(fakeReadyDB);
  console.log("fakeSuccessDB==6");
  console.log(fakeSuccessDB);

  const isReadySuccess = fakeSuccessDB.find(
    (item) => item.partner_order_id === oid
  );

  if (!!isReadySuccess) {
    return res.json({
      result: true,
      msg: null,
      orderData: isReadySuccess,
    });
  } else {
    return res.json({
      result: false,
      msg: "select fail",
      orderData: null,
    });
  }
}

export {
  kakaoPayReadyController,
  kakaoPayApproveController,
  kakaoPaySuccessController,
  kakaoPaySelectOrder,
};
