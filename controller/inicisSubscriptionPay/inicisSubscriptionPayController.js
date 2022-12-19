import inicisSimplePayService from "../../service/inicisSimplePay/inicisSimplePayService.js";
import inicisSubscriptionPayService from "../../service/inicisSubscriptionPay/inicisSubscriptionPayService.js";
import { inicisConst, url } from "../../config/config.js";

// desktop return URL
const inicisSubscriptionPayDesktop = async (req, res) => {
  try {
    const redirect = await
    inicisSubscriptionPayService.inicisSubscriptionPayDesktopService(
      req.body,
    );

    return res.redirect(redirect);
  } catch (err) {
    console.log(err);
    return res.redirect(url.fail);
  }
};

const inicisSubscriptionReadyController = async (req, res) => {
  try {
    const data = await inicisSimplePayService.inicisSimplePayReadyService(
      req.body, inicisConst.subscription,
    );
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
};

const inicisSubscriptionPayMobile = async (req, res) => {
  try {
    const redirect = await inicisSubscriptionPayService.inicisSubscriptionPayMobileService(req.body);
    return res.redirect(redirect);
  } catch (err) {
    console.log(err);
    return res.redirect(url.fail);
  }
};

export default {
  inicisSubscriptionPayDesktop,
  inicisSubscriptionReadyController,
  inicisSubscriptionPayMobile,
};

