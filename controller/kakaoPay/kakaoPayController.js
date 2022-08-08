import rp from "request-promise";
import dotenv from "dotenv";
import insertDBHandle from "../../db/insert.js";
import selectDBHandle from "../../db/select.js";

dotenv.config();

// 카카오페이 결제 준비
async function kakaoPayReadyController(req, res) {
  const { body } = req;

  const {
    quantity,
    total_amount,
    item_name,
    partner_order_id,
    buyerName,
    partner_user_id,
  } = body;

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

  const query =
    "INSERT INTO kakaoReay (tid, oid, item_name, totalPrice, buyerName, partner_user_id) VALUES(?, ?, ? ,?, ?, ?)";
  const params = [
    tid,
    partner_order_id,
    item_name,
    total_amount,
    buyerName,
    partner_user_id,
  ];
  const isInsertDB = await insertDBHandle(query, params);

  if (!isInsertDB) {
    return res.json({ result: false, msg: "DataBase insert fail" });
  }

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

  const query = `SELECT tid, partner_user_id FROM kakaoPay where oid='${oid}'`;
  const selectData = await selectDBHandle(query);

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
      partner_order_id: oid,
      partner_user_id: selectData.partner_user_id,
      pg_token,
    },
    headers: {
      Authorization: `KakaoAK ${process.env.NODE_KAKAO_ADMINKEY}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!!kakaoReady) {
    return res.json({
      result: true,
      msg: "approve success",
      kakaoPayApproveUrl: `/kakaopay-success/${oid}`,
    });
  } else {
    return res.json({
      result: true,
      msg: "approve fail",
      kakaoPayApproveUrl: `/kakaopay-fail`,
    });
  }
}

async function kakaoPaySuccessController(req, res) {
  const {
    query: { tid },
  } = req;

  const query = `SELECT partner_order_id FROM kakaoPay where tid='${tid}'`;
  const selectData = await selectDBHandle(query);

  if (selectData) {
    return res.json({
      result: true,
      msg: null,
      kakaoPayApproveUrl: `/kakaopay-success/${selectData.partner_order_id}`,
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

  const query = `SELECT tid, oid, item_name, totalPrice, buyerName, partner_user_id FROM kakaoPay where oid='${oid}'`;
  const selectData = await selectDBHandle(query);

  if (selectData) {
    const { tid, oid, item_name, totalPrice, buyerName, partner_user_id } =
      selectData;
    return res.json({
      result: true,
      msg: null,
      orderData: {
        tid,
        oid,
        item_name,
        totalPrice,
        buyerName,
        partner_user_id,
      },
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
