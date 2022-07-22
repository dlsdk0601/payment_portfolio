import rp from "request-promise";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.NODE_KAKAO_ADMINKEY);
const fakeReadyDB = [];
const fakeSuccessDB = [];

async function kakaoPayReadyController(req, res) {
  const { body } = req;

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

  const isReadySuccess = fakeReadyDB.some((item) => item.tid === tid);

  if (isReadySuccess) {
    return res.json({
      result: true,
      msg: null,
      kakaoPayApproveUrl: `/kakaopay-success/${tid}`,
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
