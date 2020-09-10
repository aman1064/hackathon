import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

import "./index.scss";

const Loader = ({ theme, size, type }) => {
  const className = cx("spinnerLoader", theme, size, type);
  return <div className={className} />;
};

Loader.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  theme: PropTypes.oneOf(["dark", "light"]),
  type: PropTypes.oneOf(["dots", "circle"])
};

Loader.defaultProps = {
  size: "medium",
  theme: "dark",
  type: "circle"
};

export default Loader;
