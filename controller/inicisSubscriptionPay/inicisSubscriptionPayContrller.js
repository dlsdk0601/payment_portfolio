import crypto from "crypto";
import rp from "request-promise";
import { code, dbQuery, inicisConst, url } from "../../config/config.js";
import updateDBHandle from "../../db/update.js";

const inicisSubscriptionPayDesktop = async (req, res) => {
  const { body: { resultCode, authToken, authUrl, mid, charset } } = req;

  if (resultCode !== code.successCodePc) {
    return res.redirect(url.fail);
  }

  const timestamp = Date.now();
  const requestJson = {
    mid,
    authToken,
    timestamp,
    signature: crypto.createHash("sha256").update(`authToken=${authToken}&timestamp=${timestamp}`).digest("hex"),
    charset,
    format: "JSON",
  };

  const inicisAccess = await rp({
    method: "POST",
    uri: authUrl,
    form: requestJson,
    json: true,
  });

  const { resultCode: accessResult, tid, MOID } = inicisAccess;

  if (accessResult !== code.successCodePc) {
    return res.redirect(url.fail);
  }

  const params = [tid, inicisConst.ing, MOID];
  const isUpdateDB = await updateDBHandle(dbQuery.updateInicisPayment, params);

  if (!isUpdateDB) {
    return res.redirect(url.fail);
  }

  return res.redirect(`${url.success}${MOID}`);
};

export default { inicisSubscriptionPayDesktop };
