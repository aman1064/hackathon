import React from "react";
import { Link } from "react-router-dom";

import CTA_Arrow from "../../../assets/images/svg/CTA_Arrow.svg";
import "./AnimatedCTA.scss";

const AnimatedCTA = ({ text, onClick, to, className = "" }) => (
  <div className={`AnimatedCTA ${className}`}>
    <div className="buttonEffect" />
    <Link to={to} onClick={onClick}>
      {text} <img src={CTA_Arrow} alt="arrow right icon" />
    </Link>
  </div>
);

export default AnimatedCTA;
