import React from "react";
import PropTypes from "prop-types";import { Size } from "./icon__constants";
const SpriteIcon = ({ viewBox = "0 0 20 20", url }) => ({
  className = "",
  size = Size.Size18,
  width = 0,
  height = 0,
  paddingTop = "",
  viewBox: customViewBox,
  style: customStyle = {},
  ...restProps
}) => {
  const classes = ["icon", className].filter(Boolean).join(" ");  const style =
    width || height
      ? {
          width,
          height
        }
      : {
          width: size,
          height: size
        };  if (paddingTop) {
    style.paddingTop = paddingTop;
  }  const svgStyle = { width: `${style.width}px`, height: `${style.height}px` };
  return (
    <span
      {...restProps}
      className={classes}
      style={{ ...style, ...customStyle }}
    >
      <svg viewBox={customViewBox || viewBox} {...svgStyle}>
        <use xlinkHref={url} />
      </svg>
    </span>
  );
};SpriteIcon.propTypes = {
  viewBox: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  style: PropTypes.object
};SpriteIcon.defaultProps = {
  style: {}
};export default SpriteIcon;