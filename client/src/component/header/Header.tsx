import React from "react";
import { Link } from "react-router-dom";
import "./css/Header.css";

export default function Header() {
  return (
    <header className="header">
      <ul className="menu-box">
        <li className="menu">
          <Link to="/inicis-onetime">inicis 단일결제</Link>
        </li>
        <li className="menu">
          <Link to="/inicis-regular">inicis 정기결제</Link>
        </li>
        <li className="menu">
          <Link to="/kakaopay">kakaopay</Link>
        </li>
      </ul>
    </header>
  );
}
