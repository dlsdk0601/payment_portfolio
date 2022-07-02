import React from "react";

import "./css/Wrapper.css";

interface AuxProps {
  children: JSX.Element | JSX.Element[] | string | string[];
}

const Wrapper: React.FC<AuxProps> = ({ children }) => {
  return <div className="wrapper">{children}</div>;
};

export default Wrapper;
