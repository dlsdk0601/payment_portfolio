// lib
import Axios from "../../server/Axios";
import React from "react";

// css
import "./css/MainSectionStyle.css";

export default function MainSection() {
  const navi = navigator.userAgent;

  console.log(process.env);

  const testFetch = async () => {
    const test = await Axios.get("/api/test");

    console.log("test===");
    console.log(test);
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
    </>
  );
}
