import React from "react";
import { useLocation } from "react-router-dom";

export default function PayFailPage() {
  const aaa = useLocation();
  console.log(aaa);
  return <div>실패</div>;
}
