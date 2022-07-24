/* eslint-disable react-hooks/exhaustive-deps */
// lib
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { IDefaultResponse } from "../../Interface";
import Axios from "../../server/Axios";

const KakaoPayToken = () => {
  const { search } = useLocation();
  const { oid } = useParams();
  const pg_token = new URLSearchParams(search).get("pg_token");

  const kakaoPayApproveFetch = async () => {
    console.log("oid===");
    console.log(oid);

    console.log("pg_token====");
    console.log(pg_token);
    if (!oid || !pg_token) {
      return;
    }

    const req = { pg_token, oid };
    const kakaoPayApprove: IDefaultResponse = await Axios.post(
      "/kakao/approve",
      req
    );

    console.log("kakaoPayApprove===");
    console.log(kakaoPayApprove);

    if (kakaoPayApprove.result) {
      window.close();
    }
  };

  useEffect(() => {
    kakaoPayApproveFetch();
  }, [oid, pg_token]);

  return <div>Loading....</div>;
};

export default KakaoPayToken;
