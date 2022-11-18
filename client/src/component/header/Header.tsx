import React from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";
import "./css/Header.css";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="header">
      <ul className="menu-box">
        <li
          className={classNames("menu", {
            active: pathname.includes("simple"),
          })}
        >
          <Link to="/inicis-simple">inicis 단일결제</Link>
        </li>
        <li
          className={classNames("menu", {
            active: pathname.includes("regular"),
          })}
        >
          <Link to="/inicis-regular">inicis 정기결제</Link>
        </li>
        <li
          className={classNames("menu", {
            active: pathname.includes("kakaopay"),
          })}
        >
          <Link to="/kakaopay">kakaopay</Link>
        </li>
      </ul>
    </header>
  );
}
