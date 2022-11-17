// lib
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IKakaoOrderSelectResponse } from "../../api/Interface";
import Axios from "../../api/Axios";
import "./css/KakaoPaySuccess.css";

const KakaoPaySuccess = () => {
  const { oid } = useParams();

  const [tid, setTid] = useState<string>("");
  const [buyerName, setBuyerName] = useState("");
  const [goodName, setGoodName] = useState<string>("");
  const [totPrice, setTotPrice] = useState<number>(0);

  const selectOrder = async () => {
    const selectAPI: IKakaoOrderSelectResponse = await Axios.get(
      `kakao/select-order?oid=${oid}`
    );

    if (selectAPI.result) {
      const { tid, item_name, totalPrice, buyerName } = selectAPI.orderData;
      setTid(tid);
      setGoodName(item_name);
      setTotPrice(totalPrice);
      setBuyerName(buyerName);
    }
  };

  useEffect(() => {
    selectOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oid]);

  return (
    <>
      <div className="title">성공</div>
      <p className="one_line">구매자: {buyerName}</p>
      <p className="one_line">구매상품: {goodName}</p>
      <p className="one_line">주문번호: {oid}</p>
      <p className="one_line">결제 금액: {totPrice}</p>
      <p className="one_line">tid(거래번호): {tid}</p>
    </>
  );
};

export default KakaoPaySuccess;
