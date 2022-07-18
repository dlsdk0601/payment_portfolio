import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IpaymentResponse } from "../Interface";
import Axios from "../server/Axios";

export default function PaySuccessPage() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("oid");
  const [paymentResponse, setPaymentResponse] = useState<IpaymentResponse>({
    CARD_Quota: "",
    CARD_ClEvent: "",
    CARD_CorpFlag: "",
    buyerTel: "",
    parentEmail: "",
    applDate: "",
    buyerEmail: "",
    p_Sub: "",
    resultCode: "",
    mid: "",
    CARD_UsePoint: "",
    CARD_Num: "",
    authSignature: "",
    ISP_CardCode: "",
    tid: "",
    EventCode: "",
    goodName: "",
    TotPrice: "",
    payMethod: "",
    CARD_MemberNum: "",
    MOID: "",
    CARD_Point: "",
    currency: "",
    CARD_PurchaseCode: "",
    CARD_PrtcCode: "",
    applTime: "",
    goodsName: "",
    CARD_CheckFlag: "",
    FlgNotiSendChk: "",
    CARD_Code: "",
    CARD_BankCode: "",
    CARD_TerminalNum: "",
    ISP_RetrievalNum: "",
    P_FN_NM: "",
    buyerName: "",
    p_SubCnt: "",
    applNum: "",
    resultMsg: "",
    CARD_Interest: "",
    CARD_SrcCode: "",
    CARD_ApplPrice: "",
    CARD_GWCode: "",
    custEmail: "",
    CARD_PurchaseName: "",
    CARD_PRTC_CODE: "",
    payDevice: "",
  });

  const selectResultFetch = async () => {
    if (!keyword) {
      return;
    }

    const res: IpaymentResponse = await Axios.get(
      `/inicis/select-result?oid=${keyword}`
    );

    setPaymentResponse({ ...res });
  };

  useEffect(() => {
    selectResultFetch();
  }, []);

  return (
    <>
      <div>성공</div>
      <p>주문자: {paymentResponse.buyerName}</p>
      <p>구매상품: {paymentResponse.goodName}</p>
      <p>주문번호: {paymentResponse.MOID}</p>
      <p>결제 금액: {paymentResponse.TotPrice}</p>
      <p>mid(상점 아이디): {paymentResponse.mid}</p>
      <p>tid(거래번호): {paymentResponse.tid}</p>
    </>
  );
}
