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

function App() {
  const navi = navigator.userAgent;
  console.log("navi===");
  console.log(navi);
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/inicis-onetime" element={<InicisOnTimePage />} />
        <Route path="/inicis-regular" element={<InicisRegularPage />} />
        <Route path="/kakaopay" element={<KakaoPayPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
