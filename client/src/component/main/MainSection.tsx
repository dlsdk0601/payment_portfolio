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

    console.log("test===");
    console.log(test);
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
      <div onClick={testFetch}>click</div>
      <p>{test ? "success" : "fail"}</p>
    </>
  );
}
