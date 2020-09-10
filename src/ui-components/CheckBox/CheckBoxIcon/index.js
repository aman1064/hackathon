import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./index.scss";

const CheckBoxIcon = ({ disabled, checked, className }) => {
  return (
    <div className={cx("checkicon-cntr", className)}>
      <span className={cx({ checked, unchecked: !checked, disabled })} />
    </div>
  );
};

CheckBoxIcon.propTypes = {
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  className: PropTypes.string
};

CheckBoxIcon.defaultProps = {
  className: ""
};

export default CheckBoxIcon;
