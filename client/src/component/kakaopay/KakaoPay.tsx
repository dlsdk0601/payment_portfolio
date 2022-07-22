// lib
import React, { useState } from "react";
import Axios from "../../server/Axios";
import randomStringFunc from "../common/RandomString";
import { IKakaoReadyResponse, ISelectKakaoPayResponse } from "../../Interface";
import { useNavigate } from "react-router-dom";

const KakaoPay = () => {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().indexOf("mobile") !== -1;

  const navigate = useNavigate();

  const [buyername, setBuyername] = useState("");
  const [buyertel, setBuyertel] = useState("");
  const [buyeremail, setBuyeremail] = useState("");
  const [goodCount, setGoodCount] = useState(1);

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
  ): Promise<any> => {
    e.preventDefault();
    console.log("payment start");

    // if (!buyername) {
    //   alert("주문자를 입력하세요");
    //   return;
    // }
    // if (!buyertel) {
    //   alert("전화번호를 입력하세요");
    //   return;
    // }
    // if (!buyeremail) {
    //   alert("이메일를 입력하세요");
    //   return;
    // }

    // create oid and timeStamp
    const timeStamp = +new Date();
    const partner_order_id = timeStamp + randomStringFunc(7); //timeStamp + randomString

    const req = {
      cid: "TC0ONETIME", // 가맹점 코드 지금은 테스트 코드
      partner_order_id, // 주문번호
      partner_user_id: "partner_user_id", // 가맹점 회원 id
      item_name: "초코파이", //상품명
      quantity: 1, //상품 수량
      total_amount: 1000, //결제금액
      tax_free_amount: 0, //비과세
      approval_url: `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/kakaopay-token/${partner_order_id}`,
      cancel_url: `${
        process.env.REACT_APP_BASEURL || "http://localhost:5000"
      }/paymentfail`,
      fail_url: `${
        process.env.REACT_APP_BASEURL || "http://localhost:3000"
      }/paymentfail`,
    };

    const kakaoPayres: IKakaoReadyResponse = await Axios.post(
      "/kakao/ready",
      req
    );

    if (!kakaoPayres.result) {
      alert("결제 준비 실패");
      return undefined;
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
            placeholder="-없이 입력"
            value={buyertel}
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
        <button type="submit">결제 하기</button>
      </form>
    </>
  );
};

export default KakaoPay;
