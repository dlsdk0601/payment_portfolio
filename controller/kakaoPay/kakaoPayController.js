import { responseMessage } from "../../config/config.js";
import kakaoPayService from "../../service/kakaoPay/kakaoPayService.js";

// 카카오페이 결제 준비
async function kakaoPayReadyController(req, res) {
  try {
    const data = await kakaoPayService.kakaoPayReadyService(req.body);
    console.log("data");
    console.log(data);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ result: false, msg: responseMessage.kakaoPayTotalPriceError });
  }
}

// 카카오페이 결제 승인
async function kakaoPayApproveController(req, res) {
  const {
    body: { pg_token, oid },
  } = req;

  try {
    const data = await kakaoPayService.kakaoPayApproveService(pg_token, oid);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({
      result: false, msg: responseMessage.kakaoPayError,
    });
  }
}

// 결제 승인난 카카오페이 조회
async function kakaoPaySuccessController(req, res) {
  const {
    query: { tid },
  } = req;

  try {
    const data = await kakaoPayService.kakaoPaySuccessService(tid);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ result: false, msg: responseMessage.selectDataFail });
  }
}

// 결제 완료 페이지에서 조회
async function kakaoPaySelectOrder(req, res) {
  const {
    query: { oid },
  } = req;

  try {
    const data = await kakaoPayService.kakaoPaySelectOrderService(oid);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({ result: false, msg: responseMessage.selectDataFail });
  }
}

export {
  kakaoPayReadyController,
  kakaoPayApproveController,
  kakaoPaySuccessController,
  kakaoPaySelectOrder,
};
