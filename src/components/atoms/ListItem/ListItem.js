import React from "react";
import PropTypes from "prop-types";

function ListItem({ customClass, description }) {
  return (
    <li className={`marginTop_12 fontSize_13 ${customClass}`}>{description}</li>
  );
}

ListItem.defaultProps = {
  customClass: ""
};
ListItem.propTypes = {
  customClass: PropTypes.string,
  description: PropTypes.string.isRequired
};
export default ListItem;
