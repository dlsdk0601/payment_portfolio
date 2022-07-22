// lib
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IKakaoOrderSelectResponse } from "../../Interface";
import Axios from "../../server/Axios";

const KakaoPaySuccess = () => {
  const { tid } = useParams();

  const [oid, setOid] = useState<string>("");
  const [goodName, setGoodName] = useState<string>("");
  const [totPrice, setTotPrice] = useState<string>("");

  const selectOrder = async () => {
    const selectAPI: IKakaoOrderSelectResponse = await Axios.get(
      `kakao/select-order?tid=${tid}`
    );

    console.log("selectAPI===");
    console.log(selectAPI);

    if (selectAPI.result) {
      const {
        partner_order_id,
        item_name,
        amount: { total },
      } = selectAPI.orderData;
      setOid(partner_order_id);
      setGoodName(item_name);
      setTotPrice(total);
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
