import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Axios from "../server/Axios";

export default function PayFailPage() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("oid");

  const selectResultFetch = async () => {
    const res = await Axios.get(`/inicis/select-result?oid=${keyword}`);

    console.log("res===");
    console.log(res);
  };

  useEffect(() => {
    if (keyword) {
      selectResultFetch();
    }
  }, []);

  return (
    <>
      <div>실패</div>
    </>
  );
}
