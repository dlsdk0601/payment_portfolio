
// return url service desktop
import crypto from "crypto";
import rp from "request-promise";
import { code, dbQuery, inicisConst, url } from "../../config/config.js";
import updateDBHandle from "../../db/update.js";

const inicisSubscriptionPayDesktopService = async (body) => {
  const { resultCode: accessRequestResult, authToken, authUrl, mid, charset } = body;

  try {
    if (accessRequestResult !== code.successCodePc) {
      return url.fail;
    }

    const timestamp = Date.now();
    const json = {
      mid,
      authToken,
      timestamp,
      signature: crypto
        .createHash("sha256")
        .update(`authToken=${authToken}&timestamp=${timestamp}`)
        .digest("hex"),
      charset,
      format: "JSON",
    };

    const inicisAccess = await rp({
      method: "POST",
      uri: authUrl,
      form: json,
      json: true,
    });

    const { resultCode: accessResult, tid, MOID, CARD_BillKey, CARD_Code } = inicisAccess;

    if (accessResult !== code.successCodePc) {
      return url.fail;
    }

    const params = [tid, inicisConst.paid, MOID];
    const billingParams = [CARD_BillKey, tid, CARD_Code];
    const isUpdateDB = await updateDBHandle(dbQuery.updateInicisPayment, params);
    const isUpdateDBInicisBilling = await updateDBHandle(
      dbQuery.insertInicisBilling, billingParams,
    );


    if (!isUpdateDB || !isUpdateDBInicisBilling) {
      return url.fail;
    }

    return `${url.success}${MOID}`;
  } catch (err) {
    console.log(err);
  }
};

const inicisSubscriptionPayMobileService = async (body) => {
  console.log(body);
  return "ddd";
};
export default {
  inicisSubscriptionPayDesktopService,
  inicisSubscriptionPayMobileService,
};
