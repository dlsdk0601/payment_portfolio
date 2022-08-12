// lib
import Axios from "../../server/Axios";
import React, { useState } from "react";

// css
import "./css/MainSectionStyle.css";

export default function MainSection() {
  const navi = navigator.userAgent;

  const [test, setTest] = useState(false);

  console.log(process.env);

  const testFetch = async () => {
    const test: { result: boolean; msg: string } = await Axios.get("/test");
    setTest(test.result);
  };

  return (
    <>
      <h2 className="title">기기 테스트</h2>
      <p>
        현재 접속하신 기기는
        {navi.toLowerCase().indexOf("mobile") === -1 ? "PC" : "mobile"}
        입니다
      </p>
      <button className="main__clcik__button" onClick={testFetch}>
        click
      </button>
      <p className="main__result__text">서버통신 {test ? "success" : "fail"}</p>
    </>
  );
}
