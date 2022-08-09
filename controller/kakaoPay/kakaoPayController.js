import rp from "request-promise";
import dotenv from "dotenv";
import insertDBHandle from "../../db/insert.js";
import selectDBHandle from "../../db/select.js";
import updateDBHandle from "../../db/update.js";

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

  if (!kakaoReady) {
    return res.json({ result: false, msg: "kakaoPay Ready API fail" });
  }

  const { tid, next_redirect_mobile_url, next_redirect_pc_url } =
    JSON.parse(kakaoReady);

  const query =
    "INSERT INTO kakaoPay (tid, oid, item_name, totalPrice, buyerName, partner_user_id) VALUES(?, ?, ? ,?, ?, ?)";
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

// 카카오페이 결제 승인
async function kakaoPayApproveController(req, res) {
  const {
    body: { pg_token, oid },
  } = req;

  const selectQuery = `SELECT tid, partner_user_id FROM kakaoPay where oid='${oid}'`;
  const selectData = await selectDBHandle(selectQuery);

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

  if (!kakaoReady) {
    return res.json({
      result: true,
      msg: "approve fail",
      kakaoPayApproveUrl: `/kakaopay-fail`,
    });
  }

  const updateQuery = `UPDATE kakaoPay set isSuccess=? where tid=?`;
  const params = [1, selectData.tid];
  const updateDB = await updateDBHandle(updateQuery, params);

  if (updateDB) {
    return res.json({
      result: true,
      msg: "approve success",
      kakaoPayApproveUrl: `/kakaopay-success/${oid}`,
    });
  }
}

// 결제 승인난 카카오페이 조회
async function kakaoPaySuccessController(req, res) {
  const {
    query: { tid },
  } = req;

  const query = `SELECT oid, isSuccess FROM kakaoPay where tid='${tid}'`;
  const selectData = await selectDBHandle(query);

  if (!selectData) {
    return res.json({
      result: true,
      msg: "there is not Tid",
      kakaoPayApproveUrl: `/kakaopay-fail`,
    });
  }

  if (selectData.isSuccess !== 1) {
    return res.json({
      result: true,
      msg: "pay fail",
      kakaoPayApproveUrl: `/kakaopay-fail`,
    });
  }

  return res.json({
    result: true,
    msg: null,
    kakaoPayApproveUrl: `/kakaopay-success/${selectData.oid}`,
  });
}

// 결제 완료 페이지에서 조회
async function kakaoPaySelectOrder(req, res) {
  const {
    query: { oid },
  } = req;

  const query = `SELECT tid, oid, item_name, totalPrice, buyerName, isSuccess FROM kakaoPay where oid='${oid}'`;
  const selectData = await selectDBHandle(query);

  if (selectData) {
    const { tid, oid, item_name, totalPrice, buyerName } = selectData;
    return res.json({
      result: true,
      msg: null,
      orderData: {
        tid,
        oid,
        item_name,
        totalPrice,
        buyerName,
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
