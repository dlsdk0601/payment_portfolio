/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {api} from "../../api/api";

const KakaoPayToken = () => {
  const { search } = useLocation();
  const { oid } = useParams();
  const pg_token = new URLSearchParams(search).get("pg_token");

  const kakaoPayApproveFetch = async (): Promise<void | undefined> => {
    if (!oid || !pg_token) {
      return;
    }

    const req = { pg_token, oid };

    const kakaoPayApprove = await api.kakaopayApprove(req);

    if (kakaoPayApprove.result) {
      console.log("here")
      window.close();
    }
  };

  useEffect(() => {
    kakaoPayApproveFetch();
  }, [oid, pg_token]);

  return <div>Loading....</div>;
};

export default KakaoPayToken;
