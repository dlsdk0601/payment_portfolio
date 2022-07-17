import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Axios from "../server/Axios";

interface ISelectData {
  mid: string;
  authToken: string;
  timestamp: number;
  signature: string;
  charset: string;
  format: string;
  result: boolean;
  oid: string;
}

interface ISelectResult {
  result: boolean;
  msg: string | null;
  data: ISelectData | null;
  code: number;
}

export default function PayFailPage() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("oid");
  const [errorText, setErrorText] = useState("");

  const errorCode: { code: number; msg: string }[] = [
    { code: 101, msg: "주문번호가 잘못됐습니다." },
    { code: 200, msg: `주문번호 ${keyword}는 결제에 실패했습니다.` },
    { code: 102, msg: `주문번호 ${keyword}가 조회되지 않습니다.` },
    { code: 103, msg: `주문번호 ${keyword}가 조회되지 않습니다.` },
  ];

  const selectResultFetch = async () => {
    const res: ISelectResult = await Axios.get(
      `/inicis/select-result?oid=${keyword}`
    );

    if (!res) {
      setErrorText("결제 내역이 조회되지 않습니다.");
      return;
    }

    const { code } = res;
    const errMsg = errorCode.find((item) => item.code === code);
    if (errMsg) {
      setErrorText(errMsg.msg);
    } else {
      setErrorText(`에러코드가 존재하지 않습니다. 에러코드: ${code}`);
    }
  };

  useEffect(() => {
    if (keyword) {
      selectResultFetch();
    }
  }, []);

  return (
    <>
      <div>실패</div>
      <p>{errorText}</p>
    </>
  );
}
