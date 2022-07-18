import rp from "request-promise";
import crypto from "crypto";

const fakeDB = [];
async function inicisOneTimeMobile(req, res) {}

async function inicisOneTimeDesktop(req, res) {
  const {
    body: {
      resultCode: accessRequestResult,
      authToken,
      authUrl,
      mid,
      charset,
      orderNumber,
    },
  } = req;

  if (accessRequestResult !== "0000") {
    return res.redirect(`${process.env.NODE_BASEURL}/paymentfail`);
  }

  const timestamp = Date.now();

  const reqJSON = {
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
    form: reqJSON,
    json: true,
  });

  const { resultCode: accessResult } = inicisAccess;

  reqJSON.oid = orderNumber;
  if (accessResult === "0000") {
    inicisAccess.result = true;
    fakeDB.push(reqJSON);
    return res.redirect(
      `${process.env.NODE_BASEURL}/paymentsuccess?oid=${orderNumber}`
    );
  } else {
    reqJSON.result = false;
    fakeDB.push(reqJSON);
    return res.redirect(
      `${process.env.NODE_BASEURL}/paymentfail?oid=${orderNumber}`
    );
  }
}

function inicisOntimeController(req, res) {
  const {
    body: { isMobile },
  } = req;

  if (isMobile) {
    inicisOneTimeMobile(req, res);
  } else {
    inicisOneTimeDesktop(req, res);
  }
}

function inicisOneTimereadyController(req, res) {
  const {
    body: { goodCount, totalPrice },
  } = req;
  // console.log(oid);
  if (totalPrice === 1000 * goodCount) {
    return res.json({
      result: true,
      msg: "totalPrice success",
    });
  }
  return res.json({
    result: false,
    msg: "totalPrice fail",
  });
}

function selectResultController(req, res) {
  const {
    query: { oid },
  } = req;

  if (!oid) {
    return res.json({
      result: false,
      msg: null,
      data: null,
      code: 101,
    });
  }

  if (fakeDB.length === 0) {
    return res.json({
      result: false,
      msg: null,
      data: null,
      code: 103,
    });
  }

  const selectPayment = fakeDB.find((db) => db.MOID === oid || db.oid === oid);

  if (selectPayment) {
    return res.json({
      result: true,
      msg: null,
      data: selectPayment,
      code: 200,
    });
  } else {
    return res.json({
      result: false,
      msg: null,
      data: false,
      code: 102,
    });
  }
}

export {
  inicisOntimeController,
  inicisOneTimereadyController,
  selectResultController,
};
