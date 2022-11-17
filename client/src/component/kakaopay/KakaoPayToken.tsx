/* eslint-disable react-hooks/exhaustive-deps */
// lib
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ISelectKakaoPayResponse } from "../../api/Interface";
import Axios from "../../api/Axios";

const KakaoPayToken = () => {
  const { search } = useLocation();
  const { oid } = useParams();
  const pg_token = new URLSearchParams(search).get("pg_token");

  const kakaoPayApproveFetch = async (): Promise<void | undefined> => {
    if (!oid || !pg_token) {
      return;
    }

    const req = { pg_token, oid };
    const kakaoPayApprove: ISelectKakaoPayResponse = await Axios.post(
      "/kakao/approve",
      req
    );

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
