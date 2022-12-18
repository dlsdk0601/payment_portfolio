import inicisSimplePayService from "../../service/inicisSimplePay/inicisSimplePayService.js";
import { inicisConst } from "../../config/config.js";

const inicisSubscriptionPayDesktop = async (req, res) => {

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

export default { inicisSubscriptionPayDesktop, inicisSubscriptionReadyController };
