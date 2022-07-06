// lib
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component
import Header from "./component/header/Header";
import InicisOnTimePage from "./page/InicisOnTimePage";
import MainPage from "./page/MainPage";
import InicisRegularPage from "./page/InicisRegularPage";
import KakaoPayPage from "./page/KakaoPayPage";

// css
import "./App.css";
import Wrapper from "./component/common/Wrapper";
import CloseInicis from "./component/close/CloseInicis";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Wrapper>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/inicis-onetime" element={<InicisOnTimePage />} />
          <Route path="/inicis-regular" element={<InicisRegularPage />} />
          <Route path="/kakaopay" element={<KakaoPayPage />} />
          <Route path="/close-inicis" element={<CloseInicis />} />
        </Routes>
      </Wrapper>
    </BrowserRouter>
  );
}

export default App;
