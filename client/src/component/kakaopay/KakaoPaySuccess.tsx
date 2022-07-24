// lib
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IKakaoOrderSelectResponse } from "../../Interface";
import Axios from "../../server/Axios";

const KakaoPaySuccess = () => {
  const { oid } = useParams();

  const [tid, setTid] = useState<string>("");
  const [goodName, setGoodName] = useState<string>("");
  const [totPrice, setTotPrice] = useState<number>(0);

  const selectOrder = async () => {
    const selectAPI: IKakaoOrderSelectResponse = await Axios.get(
      `kakao/select-order?oid=${oid}`
    );

    console.log("selectAPI===");
    console.log(selectAPI);

    if (selectAPI.result) {
      const { tid, item_name, quantity } = selectAPI.orderData;
      setTid(tid);
      setGoodName(item_name);
      setTotPrice(quantity * 1000);
    }
  };

  useEffect(() => {
    selectOrder();
  }, [tid]);

  return (
    <>
      <div>성공</div>
      <p>구매상품: {goodName}</p>
      <p>주문번호: {oid}</p>
      <p>결제 금액: {totPrice}</p>
      <p>tid(거래번호): {tid}</p>
    </>
  );
};

export default KakaoPaySuccess;
