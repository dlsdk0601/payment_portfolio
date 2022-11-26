// lib
import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import Axios from "../../api/Axios";
import {ISelectKakaoPayResponse,} from "../../api/Interface";
import { randomStringFunc } from "../../utils/utils";
import {alertText, env, kakaoPayKey} from "../../config/config";
import {api} from "../../api/api";

const KakaoPay = () => {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().includes("mobile");

  const navigate = useNavigate();

  const item_name = "컴퓨터";
  const amount = 1000;
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");

  const countHanlder = (
    e: React.FormEvent<HTMLButtonElement>,
    isIncrease: boolean
  ) => {
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

  const paymentStart = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buyerName === "") {
      alert(alertText.noBuyername);
      return;
    }

    // create oid and timeStamp
    const timeStamp = Date.now();
    const partner_order_id = timeStamp + randomStringFunc(7); //timeStamp + randomString

    const approval_url = isMobile
      ? `${env.kakaoApproveUrlMobile}${partner_order_id}`
      : `${env.kakaoApproveUrlPc}${partner_order_id}`;

    const kakaoPayRequest = {
      buyerName,
      item_name, //상품명
      quantity, //상품 수량
      total_amount: amount * quantity, //결제금액
      tax_free_amount: 0, //비과세
      cid: kakaoPayKey.cid, // 가맹점 코드 지금은 테스트 코드
      partner_order_id, // 주문번호
      partner_user_id: kakaoPayKey.partner_user_id, // 가맹점 회원 id
      approval_url,
      cancel_url: env.kakaoCancelUrl,
      fail_url: env.kakaoFailUrl
    };

    const res = await api.kakaopayRegister(kakaoPayRequest);

    if (!res.result) {
      alert(alertText.paymentFail);
      return;
    }

    const { tid, next_redirect_mobile_url, next_redirect_pc_url } = res;

    if(typeof window === "undefined"){
      return;
    }

    if (isMobile) {
      window.location.href = next_redirect_mobile_url;
      return;
    }

    const win = window.open(
      next_redirect_pc_url,
      "kakaopay",
      "top=50px, left=200px, height=500px, width=500px"
    );
    popupClose(win, tid);
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
          <input type="text" value={quantity * amount} />
        </div>
        <button type="submit">결제 하기</button>
      </form>
    </>
  );
};

export default KakaoPay;
