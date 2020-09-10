import React from "react";
import PropTypes from "prop-types";

import * as iconObj from "../../atoms/Icon";

function SpanWithIcon({ icon, text, iconClass, iconSize, viewBox }) {
  const CustomIcon = iconObj[icon + "Icon"];

  return [
    <CustomIcon
      className={iconClass}
      key="spanwithicon1"
      size={iconSize || 14}
      viewBox={viewBox}
    />,
    <span key="spanwithicon2">{text}</span>
  ];
}

SpanWithIcon.defaultProps = {
  text: "",
  iconClass: ""
};
SpanWithIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  iconClass: PropTypes.string
};
export default SpanWithIcon;
