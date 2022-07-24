import rp from "request-promise";
import dotenv from "dotenv";

dotenv.config();

let readyresponse;
const fakeyDB = [];

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
  fakeyDB.push(fakeData);
  readyresponse = { ...fakeData };
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

  const selectData = fakeyDB.find((item) => item.partner_order_id === oid);

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
      // tid: selectData.tid,
      // partner_order_id: selectData.partner_order_id,
      // partner_user_id: selectData.partner_user_id,
      tid: readyresponse.tid,
      partner_order_id: readyresponse.partner_order_id,
      partner_user_id: readyresponse.partner_user_id,
      pg_token,
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NODE_KAKAO_ADMINKEY}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!!kakaoReady) {
    const savedData = { ...JSON.parse(kakaoReady), ...selectData };
    fakeyDB.push(savedData);
    readyresponse = { ...savedData };
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

  const isReadySuccess = fakeyDB.find((item) => item.tid === tid);

  // if (!!isReadySuccess) {
  if (readyresponse.tid === tid) {
    return res.json({
      result: true,
      msg: null,
      // kakaoPayApproveUrl: `/kakaopay-success/${isReadySuccess.partner_order_id}`,
      kakaoPayApproveUrl: `/kakaopay-success/${readyresponse.partner_order_id}`,
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

  console.log("mobile success");
  console.log("fakeSuccessD===");
  console.log(fakeyDB);

  const isReadySuccess = fakeyDB.find((item) => item.partner_order_id === oid);

  // if (!!isReadySuccess) {
  if (readyresponse.partner_order_id === oid) {
    return res.json({
      result: true,
      msg: null,
      orderData: readyresponse,
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
