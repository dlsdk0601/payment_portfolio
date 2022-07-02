import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./css/Header.css";

export default function Header() {
  const { pathname } = useLocation();
  console.log(pathname);

  return (
    <header className="header">
      <ul className="menu-box">
        <li
          className={
            pathname.indexOf("onetime") !== -1 ? "menu active" : "menu"
          }
        >
          <Link to="/inicis-onetime">inicis 단일결제</Link>
        </li>
        <li
          className={
            pathname.indexOf("regular") !== -1 ? "menu active" : "menu"
          }
        >
          <Link to="/inicis-regular">inicis 정기결제</Link>
        </li>
        <li
          className={
            pathname.indexOf("kakaopay") !== -1 ? "menu active" : "menu"
          }
        >
          <Link to="/kakaopay">kakaopay</Link>
        </li>
      </ul>
    </header>
  );
}
