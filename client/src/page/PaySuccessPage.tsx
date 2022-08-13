import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "../server/Axios";

interface Idata {
  oid: string;
  buyerName: string;
  goodName: string;
  totalPrice: string;
}
interface ISelectOrder {
  result: boolean;
  msg: string | null;
  data: Idata;
}

export default function PaySuccessPage() {
  const device = navigator.userAgent;
  const isMobile = device.toLowerCase().indexOf("mobile") !== -1;
  const { search } = useLocation();
  const tid = new URLSearchParams(search).get("tid");

  const [oid, setOid] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [goodName, setGoodName] = useState("");
  const [totPrice, setTotPrice] = useState("");

  const onSelectOrderFetch = async (): Promise<void | undefined> => {
    if (!tid) {
      return;
    }

    const res: ISelectOrder = await Axios.get(`/inicis/select?tid=${tid}`);
    console.log("res===");
    console.log(res);

    if (!res || !res.result) {
      return;
    }

    const { oid, buyerName, goodName, totalPrice } = res.data;

    setOid(oid);
    setBuyerName(buyerName);
    setGoodName(goodName);
    setTotPrice(totalPrice);
  };

  useEffect(() => {
    onSelectOrderFetch();
    // let serchtid;
    // let serchoid;
    // let serchbuyerName;
    // let serchgoodName;
    // let serchTotPrice;
    // if (isMobile) {
    //   serchtid = new URLSearchParams(search).get("P_TID");
    //   serchoid = new URLSearchParams(search).get("P_OID");
    //   serchbuyerName = new URLSearchParams(search).get("P_UNAME");
    //   serchgoodName = new URLSearchParams(search).get("goodName");
    //   serchTotPrice = new URLSearchParams(search).get("P_AMT");
    // }
    // setTid(serchtid || "");
    // setOid(serchoid || "");
    // setBuyerName(serchbuyerName || "");
    // setGoodName(serchgoodName || "");
    // setTotPrice(serchTotPrice || "");
  }, [tid]);

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
