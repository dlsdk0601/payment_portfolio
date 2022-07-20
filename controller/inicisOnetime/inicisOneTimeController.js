import rp from "request-promise";
import crypto from "crypto";

const fakeDB = [];
async function inicisOneTimeMobile(req, res) {
  const {
    body: { P_STATUS, P_RMESG1, P_TID, P_AMT, P_REQ_URL, P_NOTI },
  } = req;

  console.log("req");
  console.log(P_STATUS, P_RMESG1, P_TID, P_AMT, P_REQ_URL, P_NOTI);

  if (P_STATUS !== "00") {
    return res.redirect(`${process.env.NODE_BASEURL}/paymentfail`);
  }

  const reqJSON = {
    P_MID: "INIpayTest",
    P_TID,
  };

  const inicisAccess = await rp({
    method: "POST",
    uri: P_REQ_URL,
    form: reqJSON,
    json: true,
  });

  const arr = inicisAccess.split("&");
  console.log("arr===");
  console.log(arr);
  const isSuccess = arr.some((item) => item === "P_STATUS=00");
  console.log("isSuccess===");
  console.log(isSuccess);

  if (isSuccess) {
    fakeDB.push(inicisAccess);
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?tid=${P_TID}`
    );
  } else {
    fakeDB.push(inicisAccess);
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail?tid=${P_TID}`
    );
  }
}

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

  console.log(inicisAccess);

  const { resultCode: accessResult } = inicisAccess;

  reqJSON.oid = orderNumber;
  if (accessResult === "0000") {
    inicisAccess.result = true;
    fakeDB.push(inicisAccess);
    console.log("fakeDB===");
    console.log(fakeDB);
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentsuccess?tid=${orderNumber}`
    );
  } else {
    reqJSON.result = false;
    fakeDB.push(reqJSON);
    console.log("fakeDB===");
    console.log(fakeDB);
    return res.redirect(
      `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail?tid=${orderNumber}`
    );
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

  console.log("fakeDB===");
  console.log(fakeDB);
  if (fakeDB.length === 0) {
    return res.json({
      result: false,
      msg: null,
      data: null,
      code: 103,
    });
  }

  console.log("here1");

  const selectPayment = fakeDB.find((db) => db.MOID === oid || db.oid === oid);

  console.log("selectPayment===");
  console.log(selectPayment);

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
  inicisOneTimeDesktop,
  inicisOneTimereadyController,
  selectResultController,
  inicisOneTimeMobile,
};
