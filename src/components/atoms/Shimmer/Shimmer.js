import React from "react";

import "./Shimmer.scss";

const Shimmer = ({
  height = "16px",
  width = "36px",
  marginLeft = "0",
  marginTop = "0",
  marginRight = "0",
  marginBottom = "0",
  className = ""
}) => (
  <div
    className={`Shimmer ${className}`}
    style={{
      height: `${height}px`,
      width: `${width}px`,
      marginLeft: marginLeft === "auto" ? "auto" : `${marginLeft}px`,
      marginTop: marginTop === "auto" ? "auto" : `${marginTop}px`,
      marginRight: marginRight === "auto" ? "auto" : `${marginRight}px`,
      marginBottom: marginBottom === "auto" ? "auto" : `${marginBottom}px`
    }}
  />
);

export default Shimmer;
