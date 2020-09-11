import React from "react";
import PropTypes from "prop-types";

import "./PercentBar.scss";

const PercentBar = ({
  percent,
  color,
  direction = "horizontal",
  multiplier = 1.4
}) => {
  const styleObj =
    direction === "vertical"
      ? {
          background: color,
          height: `${percent * multiplier}px`
        }
      : {
          background: color,
          width: `${percent * multiplier}px`
        };
  return (
    <div className="PercentBar">
      <div className="bar" style={styleObj} />
      <span className="label">{parseInt(percent)}</span>
    </div>
  );
};

PercentBar.propTypes = {
  percent: PropTypes.number.isRequired,
  color: PropTypes.string
};

PercentBar.defaultProps = {
  color: "#abd6fc"
};

export default PercentBar;
