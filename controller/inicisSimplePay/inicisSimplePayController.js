import {
  inicisConst,
  responseMessage,
  url,
} from "../../config/config.js";
import inicisSimplePayService from "../../service/inicisSimplePay/inicisSimplePayService.js";

// mobile returnRUL
const inicisSimplePayMobile = async (req, res) => {
  try {
    const redirect = await inicisSimplePayService.incisSimplePayMobileService(req.body);
    return res.redirect(redirect);
  } catch (e) {
    console.log(e);
    return res.redirect(url.fail);
  }
};

// PC returnRUL
const inicisSimplePayDesktop = async (req, res) => {
  try {
    const redirect = await inicisSimplePayService.inicisSimplePayDesktopService(req.body);
    return res.redirect(redirect);
  } catch (e) {
    console.log(e);
    return res.redirect(url.fail);
  }
};

// 결제 등록 API controller
const inicisSimplePayReadyController = async (req, res) => {
  try {
    const data = await inicisSimplePayService.inicisSimplePayReadyService(
      req.body, inicisConst.simple,
    );
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
};

// 주문번호로 결제 내역 조회
const inicisSimplePayOrderSelect = async (req, res) => {
  const oid = req.query.oid;
  try {
    const data = await inicisSimplePayService.inicisSimplePayOrderSelectService(oid);
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.json({
      result: false,
      msg: responseMessage.selectDataFail,
      data: null,
    });
  }
};

// 무통장입금 통보 API controller PC
const inicisSimplePayVbankDesktop = async (req, res) => {
  const {
    body: { no_oid },
  } = req;

  try {
    const result = await inicisSimplePayService.inicisSimplePayVbankDesktop(no_oid);
    return res.write(result);
  } catch (err) {
    console.log(err);
    return res.write(inicisConst.fail);
  }
};

// 무통장입금 통보 API controller mobile
const inicisSimplePayVbankMobile = async (req, res) => {
  const {
    body: { P_OID },
  } = req;

  try {
    const result = await inicisSimplePayService.inicisSimplePayVbankMobile(P_OID);
    return res.write(result);
  } catch (err) {
    console.log(err);
    return res.write(inicisConst.fail);
  }
};

export {
  inicisSimplePayDesktop,
  inicisSimplePayReadyController,
  inicisSimplePayMobile,
  inicisSimplePayOrderSelect,
  inicisSimplePayVbankDesktop,
  inicisSimplePayVbankMobile,
};
