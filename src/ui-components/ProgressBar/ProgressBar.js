import React from "react";
import PropTypes from "prop-types";

import "./ProgressBar.scss";

const ProgressBar = ({ color, complete }) => (
  <div className="ProgressBar" style={{ color: color }}>
    <div className="background" />
    <div className="progress" style={{ width: `${complete}%` }} />
  </div>
);

ProgressBar.propTypes = {
  color: PropTypes.string,
  complete: PropTypes.number
};

ProgressBar.defaultProps = {
  color: "#ffa800",
  complete: 20
};

export default ProgressBar;
