// lib
import React, { useRef, useState } from "react";

// component
import randomStringFunc from "../common/RandomString";
import Axios from "../../server/Axios";
import SHA256 from "../../server/TestSHA256";

export default function InicisRegularSection() {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().indexOf("mobile") !== -1;

  const mobilePurchaseRef = useRef() as React.MutableRefObject<HTMLFormElement>;

  const [buyername, setBuyername] = useState("");
  const [buyertel, setBuyertel] = useState("");
  const [buyeremail, setBuyeremail] = useState("");
  const [goodCount, setGoodCount] = useState(1);
  const [gopaymethod, setGopaymethod] = useState("");
  const [timeStamp, setTimeStamp] = useState(0);
  const [oid, setOid] = useState("");

  const countHanlder = (
    e: React.FormEvent<HTMLButtonElement>,
    isIncrease: boolean
  ): void => {
    e.preventDefault();
    if (isIncrease) {
      setGoodCount((prev) => prev + 1);
      return;
    }

    if (!isIncrease && goodCount > 0) {
      setGoodCount((prev) => prev - 1);
      return;
    }
  };

  const paymentStart = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<any> => {
    e.preventDefault();

    if (!buyername) {
      alert("주문자를 입력하세요");
      return;
    }
    if (!buyertel) {
      alert("전화번호를 입력하세요");
      return;
    }
    if (!buyeremail) {
      alert("이메일를 입력하세요");
      return;
    }
    if (!gopaymethod) {
      alert("결제수단을 선택하세요");
      return;
    }

    // create oid and timeStamp
    const timeStamp = +new Date();
    const oid = timeStamp + randomStringFunc(7); //timeStamp + randomString

    // state setting for Form
    setTimeStamp(timeStamp);
    setOid(oid);
    const totalPrice = goodCount * 1000;

    const paymentData = {
      buyername,
      buyertel,
      buyeremail,
      goodCount,
      gopaymethod,
      timeStamp,
      oid,
      totalPrice,
    };

    const payPriceCompared: { result: boolean; msg: string } = await Axios.post(
      "/inicis/ready",
      paymentData
    );

    if (!isMobile && payPriceCompared.result) {
      const script = document.createElement("script");
      script.src = "https:///stdpay.inicis.com/stdjs/INIStdPay.js";
      document.head.appendChild(script);
      script.onload = (e: any) => {
        e.srcElement.ownerDocument.defaultView.INIStdPay.pay("SendPayForm_id");
      };
    }

    if (isMobile && payPriceCompared.result) {
      mobilePurchaseRef.current.action =
        "https://mobile.inicis.com/smart/payment/";
      mobilePurchaseRef.current.target = "_self";
      mobilePurchaseRef.current.submit();
    }
  };

  return (
    <>
      {isMobile ? (
        <form
          onSubmit={paymentStart}
          method="post"
          name="mobileweb"
          accept-charset="euc-kr"
          ref={mobilePurchaseRef}
          className="inicis__form"
        >
          <div className="input__box">
            <label>주문자</label>
            <input
              type="text"
              name="P_UNAME"
              value={buyername}
              onChange={(e) => setBuyername(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>주문자 전화번호</label>
            <input
              type="text"
              name="P_MOBILE"
              value={buyertel}
              placeholder="-없이 입력"
              onChange={(e) => setBuyertel(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>주문자 이메일</label>
            <input
              type="text"
              name="P_EMAIL"
              value={buyeremail}
              onChange={(e) => setBuyeremail(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>상품</label>
            <input type="text" name="goodname" value="신문" />
          </div>
          <div className="input__box">
            <label>수량</label>
            <button onClick={(e) => countHanlder(e, true)}>+</button>
            <button onClick={(e) => countHanlder(e, false)}>-</button>
            <input type="text" value={goodCount} />
          </div>
          <div className="input__box">
            <label>가격</label>
            <input type="text" name="price" value={goodCount * 1000} />
          </div>
          <div className="input__box checkBox">
            <label>카드</label>
            <input
              type="radio"
              id="paymentMethod"
              onChange={() => setGopaymethod("CARD")}
              value="카드"
            />
          </div>

          {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIBillTst 사용하면 된다. */}
          <input type="hidden" name="mid" value={"INIBillTst"} />

          <input type="hidden" name="orderid" value={oid} />

          {/* 인증 구분 D로 고정 */}
          <input type="hidden" name="authtype" value="D" />

          {/* timestamp */}
          <input type="hidden" name="timestamp" value={timeStamp} />

          {/* 제공기간 => 어느 단위로 결제를 할지 월단위 M2, 년단위 Y2  "YYYYMMDDYYYYMMDD":시작일종료일*/}
          <input type="hidden" name="timestamp" value="M2" />

          {/* hash데이터 전문위조변조 mid+orderid+timestamp+INILitekey를 해쉬화한 값 */}
          {/* 테스트 할때 INILitekey는 b09LVzhuTGZVaEY1WmJoQnZzdXpRdz09 넣으면 됨 */}
          <input
            type="hidden"
            name="hashdata"
            value={SHA256(
              `INIBillTst${oid}${timeStamp}b09LVzhuTGZVaEY1WmJoQnZzdXpRdz09`
            )}
          />

          {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. 결제 성공 유무와 결제에 대한 데이터를 보낼 서버주소*/}
          <input
            type="hidden"
            name="returnurl"
            value={
              window.location.href.indexOf("www") === -1
                ? `${
                    process.env.REACT_APP_RETURNURL_MOBILE_REGULAR ||
                    "http://localhost:5000/api/inicis/regular-mobile"
                  }`
                : `${
                    process.env.REACT_APP_RETURNURL_MOBILE_REGULAR ||
                    "https://www.localhost:5000/api/inicis/regular-mobile"
                  }`
            }
          />
          {/* 결제창을 닫기 위해서 CloseInicis라는 페이지를 새로만드로 외부 js를 호출한다.   */}
          <button className="payment__button" type="submit">
            결제 하기
          </button>
        </form>
      ) : (
        <form
          onSubmit={paymentStart}
          id="SendPayForm_id"
          className="inicis__form"
          name=""
          method="POST"
        >
          <div className="input__box">
            <label>주문자</label>
            <input
              type="text"
              name="buyername"
              value={buyername}
              onChange={(e) => setBuyername(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>주문자 전화번호</label>
            <input
              type="text"
              name="buyertel"
              value={buyertel}
              placeholder="-없이 입력"
              onChange={(e) => setBuyertel(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>주문자 이메일</label>
            <input
              type="text"
              name="buyeremail"
              value={buyeremail}
              onChange={(e) => setBuyeremail(e.target.value)}
            />
          </div>
          <div className="input__box">
            <label>상품</label>
            <input type="text" name="goodname" value="컴퓨터" />
          </div>
          <div className="input__box">
            <label>수량</label>
            <button className="btn" onClick={(e) => countHanlder(e, true)}>
              +
            </button>
            <button className="btn" onClick={(e) => countHanlder(e, false)}>
              -
            </button>
            <input type="text" value={goodCount} />
          </div>
          <div className="input__box">
            <label>가격</label>
            <input type="text" name="price" value={goodCount * 1000} />
          </div>
          <div className="input__box checkBox">
            <input
              type="radio"
              id="paymentMethod"
              name="paymentMethod"
              onChange={() => setGopaymethod("Card")}
              value="카드"
            />
            <label>카드</label>
            <input type="hidden" name="gopaymethod" value={gopaymethod} />
          </div>

          {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIBillTst 사용하면 된다. */}
          <input type="hidden" name="mid" value={"INIBillTst"} />

          {/* 발급받은 mKey를 SHA256하면 된다. 테스트할 때는 3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33 를 사용하면 된다. */}
          <input
            type="hidden"
            name="mKey"
            value={
              "3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33"
            }
          />
          <input
            type="hidden"
            name="signature"
            value={SHA256(
              `oid=${oid}&price=${1000 * goodCount}&timestamp=${timeStamp}`
            )}
          />

          <input type="hidden" name="oid" value={oid} />
          <input type="hidden" name="timestamp" value={timeStamp} />

          {/* 전문 버전 - "1.0" 고정 */}
          <input type="hidden" name="version" value="1.0" />
          {/* 가격단위 */}
          <input type="hidden" name="currency" value="WON" />

          {/* 무통장입금 현금영수증 */}
          {gopaymethod === "VBank" && (
            <input type="hidden" name="acceptmethod" value={"va_receipt"} />
          )}

          {/* 정기결제를 위한 태그 */}
          <input type="hidden" name="acceptmethod" value="BILLAUTH(Card)" />

          {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. 결제 성공 유무와 결제에 대한 데이터를 보낼 서버주소*/}
          <input
            type="hidden"
            name="returnUrl"
            value={
              window.location.href.indexOf("www") === -1
                ? `${
                    process.env.REACT_APP_RETURNURL_MOBILE_REGULAR ||
                    "http://localhost:5000/api/inicis/regular-mobile"
                  }`
                : `${
                    process.env.REACT_APP_WWWRETURNURL_MOBILE_REGULAR ||
                    "https://www.localhost:5000/api/inicis/regular-mobile"
                  }`
            }
          />
          {/* 결제창을 닫기 위해서 CloseInicis라는 페이지를 새로만드로 외부 js를 호출한다.   */}
          <input
            type="hidden"
            name="closeUrl"
            value={
              window.location.href.indexOf("www") === -1
                ? `${
                    process.env.REACT_APP_CLOSEURL_MOBILE_REGULAR ||
                    "http://localhost:5000/close-inicis"
                  }`
                : `${
                    process.env.REACT_APP_WWWCLOSEURL_MOBILE_REGULAR ||
                    "http://www.localhost:5000/close-inicis"
                  }`
            }
          />
          <button className="payment__button" type="submit">
            결제 하기
          </button>
        </form>
      )}
    </>
  );
}
