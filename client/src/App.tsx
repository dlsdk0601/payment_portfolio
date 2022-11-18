// lib
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component
import Header from "./component/header/Header";
import InicisSimplePayPage from "./page/InicisSimplePayPage";
import MainPage from "./page/MainPage";
import InicisRegularPage from "./page/InicisRegularPage";
import KakaoPayPage from "./page/KakaoPayPage";

// css
import "./App.css";
import Wrapper from "./component/common/Wrapper";
import CloseInicis from "./component/close/CloseInicis";
import PaySuccessPage from "./page/PaySuccessPage";
import PayFailPage from "./page/PayFailPage";
import KakaoPayTokenPage from "./page/KakaoPayTokenPage";
import KakaoPayFailPage from "./page/KakaoPayFailPage";
import KakaoPaySuccessPage from "./page/KakaoPaySuccessPage";
import KakaoPayTokenMB from "./component/kakaopay/KakaoPayTokenMB";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Wrapper>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/inicis-simple" element={<InicisSimplePayPage />} />
          <Route path="/payment-success" element={<PaySuccessPage />} />
          <Route path="/payment-fail" element={<PayFailPage />} />
          <Route path="/inicis-regular" element={<InicisRegularPage />} />
          <Route path="/kakaopay" element={<KakaoPayPage />} />
          <Route
            path="/kakaopay-success/:oid"
            element={<KakaoPaySuccessPage />}
          />
          <Route path="/kakaopay-fail" element={<KakaoPayFailPage />} />
          <Route path="/kakaopay-token/:oid" element={<KakaoPayTokenPage />} />
          <Route path="/kakaopayMB-token/:oid" element={<KakaoPayTokenMB />} />
          <Route path="/close-inicis" element={<CloseInicis />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
