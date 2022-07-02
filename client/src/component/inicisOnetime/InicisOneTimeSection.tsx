// lib
import React, { useState } from "react";

// css
import "./css/InicisOneTimeSectionStyle.css";

export default function InicisOneTimeSection() {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().indexOf("mobile") !== -1;

  const [buyername, setBuyername] = useState("");
  const [buyertel, setBuyertel] = useState("");
  const [buyeremail, setBuyeremail] = useState("");
  const [goodCount, setGoodCount] = useState(0);

  return (
    <form id="SendPayForm_id" method="Post">
      <div className="input__box">
        <label>주문자</label>
        <input type="text" name="buyername" value="누구" disabled />
      </div>
      <div className="input__box">
        <label>주문자 전화번호</label>
        <input type="text" name="buyertel" value="누구" disabled />
      </div>
      <div className="input__box">
        <label>주문자 이메일</label>
        <input type="text" name="buyeremail" value="누구" disabled />
      </div>
      <div className="input__box">
        <label>상품</label>
        <input type="text" name="goodname" value="컴퓨터" disabled />
      </div>
      <div className="input__box">
        <label>수량</label>
        <input type="text" value={1} disabled />
      </div>
      <div className="input__box">
        <label>가격</label>
        <input type="text" name="price" value={1000} disabled />
      </div>

      {/* mid -> 실제 테스트 환경에서는 사용자 id, 테스트할 때는 INIpayTest 사용하면 된다. */}
      <input type="hidden" name="mid" value={"INIpayTest"} />

      {/* 결제수단 payStatus 0-카드, 1-무통장, 2-핸드폰, 3-계좌이체 */}
      <input type="hidden" name="gopaymethod" value={1} />

      {/* 발급받은 mKey를 SHA256하면 된다. 테스트할 때는 3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33 를 사용하면 된다. */}
      <input
        type="hidden"
        name="mKey"
        value={
          "3a9503069192f207491d4b19bd743fc249a761ed94246c8c42fed06c3cd15a33"
        }
      />

      {/* 아래와 같이 값을 넣은 후 SHA256으로 변환하면 된다. */}
      {/* <input type="hidden"  name="signature" value={SHA256(`oid=주문번호&price=totalPrice&timestamp=타임스탬프`)} />  */}

      {/* oid -> 주문번호로 겹치지 않기 위하여 타임스탬프+랜덤문자열을 넣는게 좋다 */}
      {/* <input type="hidden"  name="oid" value={oid} />  */}
      {/* <input type="hidden"  name="timestamp" value={`${timestamp}`} />   */}
      {/* 전문 버전 - "1.0" 고정 */}
      <input type="hidden" name="version" value="1.0" />
      {/* 가격단위 */}
      <input type="hidden" name="currency" value="WON" />
      {"핸드폰결제 조건" && (
        <input type="hidden" name="acceptmethod" value={"HPP(1)"} />
      )}

      {/* 무통장입금 현금영수증 */}
      {/* <input type="hidden"  name="acceptmethod" value={"va_receipt"} /> */}

      {/* 결제 후 return하는 url로 결제 요청하는 도메인과 같아야 한다. */}
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
