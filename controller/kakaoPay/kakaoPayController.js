import rp from "request-promise";
import dotenv from "dotenv";
import insertDBHandle from "../../db/insert.js";
import selectDBHandle from "../../db/select.js";
import updateDBHandle from "../../db/update.js";
import { dbQuery, env, kakaoPayConst, responseMessage, url } from "../../config/config.js";

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
    return res.json({ result: false, msg: responseMessage.kakaoPayTotalPriceError });
  }

  const kakaoReady = await rp({
    method: "POST",
    uri: url.kakaoReady,
    form: {
      ...body,
    },
    headers: {
      Authorization: `KakaoAK ${env.kakaoAdminKey}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!kakaoReady) {
    return res.json({ result: false, msg: responseMessage.kakaoApiError });
  }

  const { tid, next_redirect_mobile_url, next_redirect_pc_url } =
    JSON.parse(kakaoReady);

  const params = [
    tid,
    partner_order_id,
    item_name,
    total_amount,
    buyerName,
    partner_user_id,
  ];

  const isInsertDB = await insertDBHandle(dbQuery.insertKakaoPay, params);

  if (!isInsertDB) {
    return res.json({ result: false, msg: responseMessage.dbInsertFail });
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

  const selectQuery = `${dbQuery.selectKakaoPay}'${oid}'`;
  const selectData = await selectDBHandle(selectQuery);

  if (!selectData) {
    return res.json({
      result: true,
      msg: responseMessage.kakaoApproveError,
    });
  }

  const kakaoReady = await rp({
    method: "POST",
    uri: url.kakaoApprove,
    form: {
      cid: env.kakaoCid,
      tid: selectData.tid,
      partner_order_id: oid,
      partner_user_id: selectData.partner_user_id,
      pg_token,
    },
    headers: {
      Authorization: `KakaoAK ${env.kakaoAdminKey}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  if (!kakaoReady) {
    return res.json({
      result: true,
      msg: responseMessage.kakaoApproveError,
      kakaoPayApproveUrl: url.kakaoFail,
    });
  }

  const params = [kakaoPayConst.paid, selectData.tid];
  const updateDB = await updateDBHandle(dbQuery.updateKakaoPay, params);

  if (updateDB) {
    return res.json({
      result: true,
      msg: responseMessage.kakaoApprove,
      kakaoPayApproveUrl: `${url.kakaoApproveClient}}${oid}`,
    });
  }
}

// 결제 승인난 카카오페이 조회
async function kakaoPaySuccessController(req, res) {
  const {
    query: { tid },
  } = req;

  const query = `${dbQuery.selectKakaoPaySuccess}'${tid}'`;
  const selectData = await selectDBHandle(query);

  if (!selectData) {
    return res.json({
      result: true,
      msg: responseMessage.kakaoTidError,
      kakaoPayApproveUrl: url.kakaoFail,
    });
  }

  if (selectData.isSuccess === kakaoPayConst.before) {
    return res.json({
      result: true,
      msg: responseMessage.kakaoPayError,
      kakaoPayApproveUrl: url.kakaoFail,
    });
  }

  return res.json({
    result: true,
    msg: null,
    kakaoPayApproveUrl: `${url.kakaoSuccess}${selectData.oid}`,
  });
}

// 결제 완료 페이지에서 조회
async function kakaoPaySelectOrder(req, res) {
  const {
    query: { oid },
  } = req;

  const query = `${dbQuery.selectKakaoPayResult}'${oid}'`;
  const selectData = await selectDBHandle(query);

  if (!selectData) {
    return res.json({
      result: false,
      msg: responseMessage.selectDataFail,
      orderData: null,
    });
  }
  const { tid, item_name, totalPrice, buyerName } = selectData;

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
}

export {
  kakaoPayReadyController,
  kakaoPayApproveController,
  kakaoPaySuccessController,
  kakaoPaySelectOrder,
};
