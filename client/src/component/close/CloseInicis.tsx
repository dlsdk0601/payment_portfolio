// lib
import React, { useEffect } from "react";

// component

export default function CloseInicis() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://stgstdpay.inicis.com/stdjs/INIStdPay_close.js";
    document.head.appendChild(script);
  }, []);
  return <></>;
}
