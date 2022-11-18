// lib
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// css
import "./css/InicisOneTimeSectionStyle.css";

// component
import SHA256 from "../../utils/SHA256";
import { api } from "../../api/api";
import { onLoadScript, randomStringFunc } from "../../utils/utils";
import { alertText, env, inicisKey, router, url } from "../../config/config";

type DIRECTION_TYPE = "PLUS" | "MINUS";

const DIRECTION = {
  PLUS: "PLUS",
  MINUS: "MINUS",
} as const;

const FORMTAG_ID = "SendPayForm_id";

export default function InicisSimplePaySection() {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().includes("mobile");

  const navigate = useNavigate();

  const mobilePurchaseRef = useRef() as React.MutableRefObject<HTMLFormElement>;

  const [buyername, setBuyername] = useState<string>("");
  const [buyertel, setBuyertel] = useState<string>("");
  const [buyeremail, setBuyeremail] = useState<string>("");
  const [goodCount, setGoodCount] = useState<number>(1);
  const [gopaymethod, setGopaymethod] = useState<string>("");
  const [goodName, setGoodName] = useState<string>("컴퓨터");
  const [timeStamp, setTimeStamp] = useState<number>(0);
  const [oid, setOid] = useState<string>("");

  const countHanlder = (
    e: React.FormEvent<HTMLButtonElement>,
    directionType: DIRECTION_TYPE
  ) => {
    e.preventDefault();
    if (directionType === DIRECTION.PLUS) {
      setGoodCount((prev) => prev + 1);
      return;
    }

    if (directionType === DIRECTION.MINUS && goodCount > 0) {
      setGoodCount((prev) => prev - 1);
    }
  };

  const paymentStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!buyername) {
      alert(alertText.noBuyername);
      return;
    }
    if (!buyertel) {
      alert(alertText.noBuyertel);
      return;
    }
    if (!buyeremail) {
      alert(alertText.noBuyeremail);
      return;
    }
    if (!gopaymethod) {
      alert(alertText.noPaymethod);
      return;
    }

    // create oid and timeStamp
    const timeStamp = Date.now();
    const oid = timeStamp + randomStringFunc(7); //timeStamp + randomString

    // state setting for Form
    setTimeStamp(timeStamp);
    setOid(oid);

    const paymentData = {
      buyername,
      buyertel,
      buyeremail,
      goodCount,
      timeStamp,
      oid,
      goodName,
      gopaymethod: gopaymethod.toUpperCase(),
      totalPrice: goodCount * 1000,
    };

    const payPriceCompared = await api.paymentRegister(paymentData);

    const isOnLoad = await onLoadScript(url.inicisJS);

    if (!isOnLoad) {
      alert("결제에 실패하였습니다. 다시 시도해주세요.");
      navigate(router.inicisFail);
      return;
    }

    if (!payPriceCompared.result) {
      alert("결제에 실패하였습니다. 다시 시도해주세요.");
      return;
    }

    if (!isMobile && payPriceCompared.result) {
      // @ts-ignore
      window.INIStdPay.pay(FORMTAG_ID);
      return;
    }

    if (isMobile && payPriceCompared.result) {
      mobilePurchaseRef.current.action = url.inicisMobileJs;
      mobilePurchaseRef.current.target = "_self";
      mobilePurchaseRef.current.submit();
    }
  };

  return (
    <>
      {isMobile ? (
        <form
          onSubmit={(e) => paymentStart(e)}
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
            <input type="text" name="P_GOODS" value="컴퓨터" />
          </div>
          <div className="input__box">
            <label>수량</label>
            <button onClick={(e) => countHanlder(e, DIRECTION.PLUS)}>+</button>
            <button onClick={(e) => countHanlder(e, DIRECTION.MINUS)}>-</button>
            <input type="text" value={goodCount} />
          </div>
          <div className="input__box">
            <label>가격</label>
            <input type="text" name="P_AMT" value={goodCount * 1000} />
          </div>
          <div className="input__box">
            <label>카드</label>
            <input
              type="radio"
              id="paymentMethod"
              name="paymentMethod"
              onChange={() => setGopaymethod("CARD")}
              value="카드"
            />
            <label>무통장</label>
            <input
              type="radio"
              id="paymentMethod"
              name="paymentMethod"
              onChange={() => setGopaymethod("VBANK")}
              value="무통장"
            />
            <input type="hidden" name="P_INI_PAYMENT" value={gopaymethod} />
          </div>

          {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIpayTest 사용하면 된다. */}
          <input type="hidden" name="P_MID" value={inicisKey.mid} />

          <input type="hidden" name="P_OID" value={oid} />

          {/* 무통장입금 현금영수증 */}
          {gopaymethod === "VBANK" && (
            <input type="hidden" name="P_RESERVED" value={"vbank_receipt=Y"} />
          )}

          {/* 가상계좌 입금통보 URL */}
          {gopaymethod === "VBANK" && (
            <input type="hidden" name="P_NOTI_URL" value={""} />
          )}

          {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. 결제 성공 유무와 결제에 대한 데이터를 보낼 서버주소*/}
          <input
            type="hidden"
            name="P_NEXT_URL"
            value={
              window.location.href.includes("www")
                ? env.mobileReturnWWWRUL
                : env.mobileReturnURL
            }
          />
          {/* 결제창을 닫기 위해서 CloseInicis라는 페이지를 새로만드로 외부 js를 호출한다.   */}
          <button className="payment__button" type="submit">
            결제 하기
          </button>
        </form>
      ) : (
        <form
          onSubmit={(e) => paymentStart(e)}
          id={FORMTAG_ID}
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
            <button
              className="btn"
              onClick={(e) => countHanlder(e, DIRECTION.PLUS)}
            >
              +
            </button>
            <button
              className="btn"
              onClick={(e) => countHanlder(e, DIRECTION.MINUS)}
            >
              -
            </button>
            <input type="text" value={goodCount} />
          </div>
          <div className="input__box">
            <label>가격</label>
            <input type="text" name="price" value={goodCount * 1000} />
          </div>
          <div className="input__box checkBox">
            <div>
              <input
                type="radio"
                id="paymentMethod"
                name="paymentMethod"
                onChange={() => setGopaymethod("Card")}
                value="카드"
              />
              <label>카드</label>
            </div>
            <div>
              <input
                type="radio"
                id="paymentMethod"
                name="paymentMethod"
                onChange={() => setGopaymethod("VBank")}
                value="무통장"
              />
              <label>무통장</label>
            </div>

            <input type="hidden" name="gopaymethod" value={gopaymethod} />
          </div>

          {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIpayTest 사용하면 된다. */}
          <input type="hidden" name="mid" value={inicisKey.mid} />

          {/* 발급받은 mKey를 SHA256하면 된다. 테스트할 때는 3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33 를 사용하면 된다. */}
          <input type="hidden" name="mKey" value={inicisKey.mKey} />

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

          {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. 결제 성공 유무와 결제에 대한 데이터를 보낼 서버주소*/}
          <input
            type="hidden"
            name="returnUrl"
            value={
              window.location.href.includes("www")
                ? env.returnWWWURL
                : env.returnURL
            }
          />
          {/* 결제창을 닫기 위해서 CloseInicis라는 페이지를 새로만드로 외부 js를 호출한다.   */}
          <input
            type="hidden"
            name="closeUrl"
            value={
              window.location.href.includes("www")
                ? env.closeWWWURL
                : env.closeURL
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
