import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ISelectResult } from "../Interface";
import Axios from "../server/Axios";

export default function PaySuccessPage() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("oid");

  const selectResultFetch = async () => {
    if (!keyword) {
      return;
    }

    const res: ISelectResult = await Axios.get(
      `/inicis/select-result?oid=${keyword}`
    );

    console.log("res===");
    console.log(res);
  };

  useEffect(() => {
    selectResultFetch();
  }, []);

  return (
    <>
      <div>성공</div>
    </>
  );
}
