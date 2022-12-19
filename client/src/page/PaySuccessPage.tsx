import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ISelectOrder } from "../api/Interface";
import Axios from "../api/Axios";
import { paymentMethod } from "../config/config";
import { api } from "../api/api";

export default function PaySuccessPage() {
  const { search } = useLocation();
  const oid = new URLSearchParams(search).get("oid");

  const [tid, setTid] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [goodName, setGoodName] = useState("");
  const [totPrice, setTotPrice] = useState("");
  const [paymethod, setPaymethod] = useState("");
  const [vactBankName, setVactBankName] = useState("");
  const [vact_Date, setVact_Date] = useState("");
  const [vact_Num, setVact_Num] = useState("");
  const [type, setType] = useState("");
  const [billing, setBilling] = useState("");

  const onSelectOrderFetch = async () => {
    if (!oid) {
      return;
    }

    const res = await api.selectPayHistory(oid);

    if (!res || !res.result) {
      return;
    }

    const {
      tid,
      buyerName,
      goodName,
      totalPrice,
      paymethod,
      vactBankName,
      VACT_Date,
      VACT_Num,
      type,
      billing
    } = res.data;

    setTid(tid);
    setBuyerName(buyerName);
    setGoodName(goodName);
    setTotPrice(totalPrice);
    setPaymethod(paymethod);
    setVactBankName(vactBankName ?? "");
    setVact_Date(VACT_Date ?? "");
    setVact_Num(VACT_Num ?? "");
    setType(type);
    setBilling(billing ?? "")
  };

  useEffect(() => {
    onSelectOrderFetch();
  }, [oid]);

  return (
    <>
      <h1 className="title">성공</h1>
      <p className="margin-bt">주문자: {buyerName}</p>
      <p className="margin-bt">구매상품: {goodName}</p>
      <p className="margin-bt">
        주문번호: <br />
        {oid}
      </p>
      <p className="margin-bt">결제 금액: {totPrice}</p>
      <p className="margin-bt">
        tid(거래번호): <br /> {tid}
      </p>
      {type === paymentMethod.subscription && <p className="margin-bt">
        biilingKey: <br/> {billing.substring(0, 7)}
        <br />
        <span>개인정보이기에 일부만 공개</span>
      </p>}

      {paymethod === paymentMethod.bank && (
        <>
          <p className="margin-bt">은행명: {vactBankName}</p>
          <p className="margin-bt">입금 기한: {vact_Date}</p>
          <p className="margin-bt">계좌번호: {vact_Num}</p>
        </>
      )}
    </>
  );
}
