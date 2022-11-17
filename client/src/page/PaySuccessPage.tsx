import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ISelectOrder } from "../Interface";
import Axios from "../server/Axios";

export default function PaySuccessPage() {
  const { search } = useLocation();
  const oid = new URLSearchParams(search).get("oid");

  const [tid, setTid] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [goodName, setGoodName] = useState("");
  const [totPrice, setTotPrice] = useState("");

  const onSelectOrderFetch = async (): Promise<void | undefined> => {
    if (!oid) {
      return;
    }

    const res: ISelectOrder = await Axios.get(`/inicis/select?oid=${oid}`);

    if (!res || !res.result) {
      return;
    }

    const { tid, buyerName, goodName, totalPrice } = res.data;

    setTid(tid);
    setBuyerName(buyerName);
    setGoodName(goodName);
    setTotPrice(totalPrice);
  };

  useEffect(() => {
    onSelectOrderFetch();
  }, [oid]);

  return (
    <>
      <div>성공</div>
      <p>주문자: {buyerName}</p>
      <p>구매상품: {goodName}</p>
      <p>주문번호: {oid}</p>
      <p>결제 금액: {totPrice}</p>
      <p>tid(거래번호): {tid}</p>
    </>
  );
}
