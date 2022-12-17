import rp from "request-promise";
import { dbQuery, env, kakaoPayConst, responseMessage, url } from "../../config/config.js";
import insertDBHandle from "../../db/insert.js";
import selectDBHandle from "../../db/select.js";
import updateDBHandle from "../../db/update.js";

// 카카오페이 결제 준비
const kakaoPayReadyService = async (body) => {
  try {
    const {
      quantity,
      total_amount,
      item_name,
      partner_order_id,
      buyerName,
      partner_user_id,
    } = body;

    if (quantity * 1000 !== total_amount) {
      return { result: false, msg: responseMessage.kakaoPayTotalPriceError };
    }
    console.log("asdfasdf");
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
      return { result: false, msg: responseMessage.kakaoApiError };
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
      return { result: false, msg: responseMessage.dbInsertFail };
    }

    return {
      result: true,
      msg: null,
      tid,
      next_redirect_mobile_url,
      next_redirect_pc_url,
    };
  } catch (err) {
    console.log(err);
  }
};

// 카카오페이 결제 승인
const kakaoPayApproveService = async (pg_token, oid) => {
  try {
    const selectQuery = `${dbQuery.selectKakaoPay}'${oid}'`;
    const selectData = await selectDBHandle(selectQuery);

    if (!selectData) {
      return {
        result: false,
        msg: responseMessage.kakaoApproveError,
      };
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
      return {
        result: false,
        msg: responseMessage.kakaoApproveError,
        kakaoPayApproveUrl: url.kakaoFail,
      };
    }

    const params = [kakaoPayConst.paid, selectData.tid];
    const updateDB = await updateDBHandle(dbQuery.updateKakaoPay, params);

    if (!updateDB) {
      return {
        result: false,
        msg: responseMessage.kakaoApproveError,
      };
    }

    return {
      result: true,
      msg: responseMessage.kakaoApprove,
      kakaoPayApproveUrl: `${url.kakaoApproveClient}}${oid}`,
    };
  } catch (err) {
    console.log(err);
  }
};

// 결제 승인난 카카오페이 조회
const kakaoPaySuccessService = async (tid) => {
  try {
    const query = `${dbQuery.selectKakaoPaySuccess}'${tid}'`;
    const selectData = await selectDBHandle(query);

    if (!selectData) {
      return {
        result: false,
        msg: responseMessage.kakaoTidError,
        kakaoPayApproveUrl: url.kakaoFail,
      };
    }

    if (selectData.isSuccess === kakaoPayConst.before) {
      return {
        result: false,
        msg: responseMessage.kakaoPayError,
        kakaoPayApproveUrl: url.kakaoFail,
      };
    }

    return {
      result: true,
      msg: null,
      kakaoPayApproveUrl: `${url.kakaoSuccess}${selectData.oid}`,
    };
  } catch (err) {
    console.log(err);
  }
};

// 결제 완료 페이지에서 조회
const kakaoPaySelectOrderService = async (oid) => {
  try {
    const query = `${dbQuery.selectKakaoPayResult}'${oid}'`;
    const selectData = await selectDBHandle(query);

    if (!selectData) {
      return {
        result: false,
        msg: responseMessage.selectDataFail,
        orderData: null,
      };
    }

    const { tid, item_name, totalPrice, buyerName } = selectData;

    return {
      result: true,
      msg: null,
      orderData: {
        tid,
        oid,
        item_name,
        totalPrice,
        buyerName,
      },
    };
  } catch (err) {
    console.log(err);
  }
};

export default {
  kakaoPayReadyService,
  kakaoPayApproveService,
  kakaoPaySuccessService,
  kakaoPaySelectOrderService,
};
