// lib
import React from "react";

// css
import "./css/MainSectionStyle.css";

export default function MainSection() {
  const navi = navigator.userAgent;

  return (
    <>
      <h2 className="title">기기 테스트</h2>
      <p>
        현재 접속하신 기기는
        {navi.toLowerCase().indexOf("mobile") === -1 ? "PC" : "mobile"}
        입니다
      </p>
    </>
  );
}
