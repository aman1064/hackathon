import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
// import { CloseIcon } from "@components/atoms/Icon/icons";

const DefaultToast = ({
  message,
  actionIcon,
  messageClassName,
  actionClassName,
  onClose
}) => (
  <>
    <div className={cx(["toast-msg", messageClassName])}>{message}</div>
    <span className={cx(["toast-action", actionClassName])} onClick={onClose}>
      {actionIcon || "X"}
    </span>
  </>
);

DefaultToast.propTypes = {
  message: PropTypes.string,
  messageClassName: PropTypes.string,
  actionClassName: PropTypes.string,
  actionIcon: PropTypes.node,
  onClose: PropTypes.func.isRequired
};

DefaultToast.defaultProps = {
  message: "",
  messageClassName: "",
  actionClassName: "",
  actionIcon: ""
};

export default DefaultToast;
