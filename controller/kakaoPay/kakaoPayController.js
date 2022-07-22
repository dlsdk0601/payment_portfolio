import rp from "request-promise";

const fakeDB = [];
async function kakaoPayReadyController(req, res) {
  const { body } = req;

  console.log("body==");
  console.log(body);

  const { quantity, total_amount } = body;
  if (quantity * 1000 !== total_amount) {
    return res.json({ result: false, msg: "kakaoPay Ready API fail" });
  }

  const kakaoReady = await rp({
    method: "POST",
    uri: "https://kapi.kakao.com/v1/payment/ready",
    form: {
      ...body,
    },
    headers: {
      Authorization: `KakaoAK 1b6727d70facf0228e4ef6de74b08f3f`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });

  const { tid, next_redirect_mobile_url, next_redirect_pc_url } =
    JSON.parse(kakaoReady);

  if (!tid) {
    return res.json({ result: false, msg: "kakaoPay Ready API fail" });
  }

  fakeDB.push(JSON.parse(kakaoReady));
  return res.json({
    result: true,
    msg: "goooddd",
    tid,
    next_redirect_mobile_url,
    next_redirect_pc_url,
  });
}

async function kakaoPayReadySuccess(req, res) {
  const {
    query: { oid },
  } = req;

  console.log("oid===");
  console.log(oid);

  console.log("fakeDB===");
  console.log(fakeDB);

  return res.json({
    result: true,
    msg: "good",
  });
}

export { kakaoPayReadyController, kakaoPayReadySuccess };
