// lib
import React, { ChangeEvent, useState } from "react";
import Axios from "../../api/Axios";
import randomStringFunc from "../../utils/RandomString";
import {
  IKakaoReadyResponse,
  ISelectKakaoPayResponse,
} from "../../api/Interface";
import { useNavigate } from "react-router-dom";

const KakaoPay = () => {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().includes("mobile");

  const navigate = useNavigate();

  const item_name = "컴퓨터";
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");

  const countHanlder = (
    e: React.FormEvent<HTMLButtonElement>,
    isIncrease: boolean
  ): void => {
    e.preventDefault();
    if (isIncrease) {
      setQuantity((prev) => prev + 1);
      return;
    }

    if (!isIncrease && quantity > 0) {
      setQuantity((prev) => prev - 1);
      return;
    }
  };

  const popupClose = (win: any, tid: string) => {
    const set = setInterval(async () => {
      if (win.closed) {
        clearInterval(set);
        const selectKakaoPay: ISelectKakaoPayResponse = await Axios.get(
          `kakao/select-success?tid=${tid}`
        );
        if (selectKakaoPay.result) {
          navigate(selectKakaoPay.kakaoPayApproveUrl);
        }
      }
    }, 1000);
  };

  const paymentStart = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void | undefined> => {
    e.preventDefault();

    if (!buyerName) {
      alert("주문자 이름을 적어주세요");
      return;
    }

    // create oid and timeStamp
    const timeStamp = +new Date();
    const partner_order_id = timeStamp + randomStringFunc(7); //timeStamp + randomString

    const approval_url = isMobile
      ? `${
          process.env.REACT_APP_BASEURL || "http://localhost:5000"
        }/kakaopayMB-token/${partner_order_id}`
      : `${
          process.env.REACT_APP_BASEURL || "http://localhost:5000"
        }/kakaopay-token/${partner_order_id}`;

    const req = {
      cid: "TC0ONETIME", // 가맹점 코드 지금은 테스트 코드
      partner_order_id, // 주문번호
      partner_user_id: "partner_user_id", // 가맹점 회원 id
      item_name: "컴퓨터", //상품명
      quantity, //상품 수량
      total_amount: 1000, //결제금액
      tax_free_amount: 0, //비과세
      approval_url,
      buyerName,
      cancel_url: `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail`,
      fail_url: `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail`,
    };

    const kakaoPayres: IKakaoReadyResponse = await Axios.post(
      "/kakao/ready",
      req
    );

    if (!kakaoPayres.result) {
      alert("결제 준비 실패");
      return;
    }

    const { tid, next_redirect_mobile_url, next_redirect_pc_url } = kakaoPayres;

    if (isMobile) {
      window.location.href = next_redirect_mobile_url;
    } else {
      const win = window.open(
        next_redirect_pc_url,
        "kakaopay",
        "top=50px, left=200px, height=500px, width=500px"
      );
      popupClose(win, tid);
    }
  };

  return (
    <>
      <form onSubmit={paymentStart}>
        <div className="input__box">
          <label>구매자</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setBuyerName(e.target.value)
            }
          />
        </div>
        <div className="input__box">
          <label>상품</label>
          <input type="text" value={item_name} />
        </div>
        <div className="input__box">
          <label>수량</label>
          <button className="btn" onClick={(e) => countHanlder(e, true)}>
            +
          </button>
          <button className="btn" onClick={(e) => countHanlder(e, false)}>
            -
          </button>
          <input type="text" value={quantity} />
        </div>
        <div className="input__box">
          <label>가격</label>
          <input type="text" value={quantity * 1000} />
        </div>
        <button type="submit">결제 하기</button>
      </form>
    </>
  );
};

export default KakaoPay;
