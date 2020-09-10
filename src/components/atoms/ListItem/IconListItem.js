import React from "react";
import PropTypes from "prop-types";
import * as iconObj from "../Icon";

function IconListItem({
  iconName,
  customClass,
  description,
  viewBox,
  size = 18
}) {
  const CustomIcon = iconObj[iconName + "Icon"];
  if (description !== "") {
    return (
      <li className={`marginTop_8 fontSize_13 icon_none ${customClass}`}>
        <CustomIcon size={size} viewBox={viewBox} className="marginRight_8" />
        {description}
      </li>
    );
  } else {
    return null;
  }
}

IconListItem.defaultProps = {
  customClass: ""
};
IconListItem.propTypes = {
  customClass: PropTypes.string,
  iconName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

export default IconListItem;
