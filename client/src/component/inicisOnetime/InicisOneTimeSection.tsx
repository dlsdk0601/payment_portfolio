// lib
import React, { useRef, useState } from "react";
import crypto from "crypto-js";

// css
import "./css/InicisOneTimeSectionStyle.css";

// component
import randomStringFunc from "../common/RandomString";

export default function InicisOneTimeSection() {
  const device = navigator.userAgent;
  const aaa = useRef(null);
  const isMobile = device.toLowerCase().indexOf("mobile") !== -1;

  const [buyername, setBuyername] = useState("");
  const [buyertel, setBuyertel] = useState("");
  const [buyeremail, setBuyeremail] = useState("");
  const [goodCount, setGoodCount] = useState(1);
  const [gopaymethod, setGopaymethod] = useState(-1);
  const [timeStamp, setTimeStamp] = useState(0);
  const [oid, setOid] = useState("");

  // console.log(crypto.SHA256("dddasdf"));
  // console.log(crypto.SHA256("dddasdf").toString(crypto.enc.Hex));
  // console.log(SHA256);

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

  const paymentStart = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("payment start");

    // validation
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
    if (gopaymethod < 0) {
      alert("결제수단을 선택하세요");
      return;
    }

    // create oid and timeStamp
    const timeStamp = +new Date();
    const oid = timeStamp + randomStringFunc(7); //timeStamp + randomString

    // state setting for Form
    setTimeStamp(timeStamp);
    setOid(oid);

    console.log("timeStamp====");
    console.log(timeStamp);
    console.log("oid===");
    console.log(oid);
    console.log(aaa.current);
  };

  return (
    <form ref={aaa} onSubmit={paymentStart} id="SendPayForm_id" method="Post">
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
        <button onClick={(e) => countHanlder(e, true)}>+</button>
        <button onClick={(e) => countHanlder(e, false)}>-</button>
        <input type="text" value={goodCount} />
      </div>
      <div className="input__box">
        <label>가격</label>
        <input type="text" name="price" value={goodCount * 1000} />
      </div>
      <div className="input__box">
        <label>카드</label>
        <input
          type="radio"
          id="0"
          name="paymentMethod"
          onChange={(e) => setGopaymethod(parseInt(e.target.id))}
          value="카드"
        />
        <label>무통장</label>
        <input
          type="radio"
          id="1"
          name="paymentMethod"
          onChange={(e) => setGopaymethod(parseInt(e.target.id))}
          value="무통장"
        />
        <label>핸드폰</label>
        <input
          type="radio"
          id="2"
          name="paymentMethod"
          onChange={(e) => setGopaymethod(parseInt(e.target.id))}
          value="핸드폰"
        />
        <label>계좌이체</label>
        <input
          type="radio"
          id="3"
          name="paymentMethod"
          onChange={(e) => setGopaymethod(parseInt(e.target.id))}
          value="계좌이체"
        />
      </div>

      {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIpayTest 사용하면 된다. */}
      <input type="hidden" name="mid" value={"INIpayTest"} />

      <input type="hidden" name="gopaymethod" value={gopaymethod} />

      {/* 발급받은 mKey를 SHA256하면 된다. 테스트할 때는 3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33 를 사용하면 된다. */}
      <input
        type="hidden"
        name="mKey"
        value={
          "3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33"
        }
      />

      {/* <input type="hidden"  name="signature" value={SHA256(`oid=주문번호&price=${1000*goodCount}&timestamp=${timeStamp}`)} />  */}
      <input
        type="hidden"
        name="signature"
        value={crypto
          .SHA256(`oid=${oid}&price=${1000 * goodCount}&timestamp=${timeStamp}`)
          .toString(crypto.enc.Hex)}
      />

      <input type="hidden" name="oid" value={oid} />
      <input type="hidden" name="timestamp" value={timeStamp} />

      {/* 전문 버전 - "1.0" 고정 */}
      <input type="hidden" name="version" value="1.0" />
      {/* 가격단위 */}
      <input type="hidden" name="currency" value="WON" />

      {/* 무형 상품 HPP(2)  유형 상품 HPP(1) */}
      {gopaymethod === 2 && (
        <input type="hidden" name="acceptmethod" value={"HPP(1)"} />
      )}

      {/* 무통장입금 현금영수증 */}
      {gopaymethod === 1 && (
        <input type="hidden" name="acceptmethod" value={"va_receipt"} />
      )}

      {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. 결제 성공 유무와 결제에 대한 데이터를 보낼 서버주소*/}
      <input
        type="hidden"
        name="returnUrl"
        value={
          window.location.href.indexOf("www") == -1
            ? `returnURL`
            : `www.returnURL`
        }
      />
      {/* 결제창을 닫기 위해서 CloseInicis라는 페이지를 새로만드로 외부 js를 호출한다.   */}
      <input
        type="hidden"
        name="closeUrl"
        value={
          window.location.href.indexOf("www") == -1
            ? `closeURL`
            : `www.closeURL`
        }
      />
      <button type="submit">결제 하기</button>
    </form>
  );
}
