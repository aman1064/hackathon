import React from "react";
import PropTypes from "prop-types";

import "./PercentBar.scss";

const PercentBar = ({ percent, color }) => (
  <div className="PercentBar">
    <div
      className="bar"
      style={{ background: color, width: `${percent * 1.4}px` }}
    />
    <span className="label">{parseInt(percent)}</span>
  </div>
);

PercentBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.string
};

PercentBar.defaultProps = {
  color: "#abd6fc"
};

export default PercentBar;
