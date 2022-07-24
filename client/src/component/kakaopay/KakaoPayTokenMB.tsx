/* eslint-disable react-hooks/exhaustive-deps */
// lib
import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ISelectKakaoPayResponse } from "../../Interface";
import Axios from "../../server/Axios";

const KakaoPayTokenMB = () => {
  const { search } = useLocation();
  const { oid } = useParams();

  const navigate = useNavigate();
  const pg_token = new URLSearchParams(search).get("pg_token");

  const kakaoPayApproveFetch = async (): Promise<any> => {
    if (!oid || !pg_token) {
      return;
    }

    const req = { pg_token, oid };
    const kakaoPayApprove: ISelectKakaoPayResponse = await Axios.post(
      "/kakao/approve",
      req
    );

    if (kakaoPayApprove.result) {
      navigate(kakaoPayApprove.kakaoPayApproveUrl);
    }
  };

  useEffect(() => {
    kakaoPayApproveFetch();
  }, [oid, pg_token]);

  return <div>Loading....</div>;
};

export default KakaoPayTokenMB;
