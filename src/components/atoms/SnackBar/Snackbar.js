import React from "react";
import cx from "classnames";
import * as iconObj from "../Icon";
import Toast from "../../../ui-components/Toast/Toast";

import "./Snackbar.scss";

const RenderToastContent = ({ message, renderContentProps }) => {
  const {
    icon,
    info,
    iconSize,
    messageClassName = "",
    className = ""
  } = renderContentProps;
  const CustomIcon = icon && iconObj[icon + "Icon"];
  return (
    <div id="message-id" className={className}>
      <p className={`toastMessage ${messageClassName}`}>
        {icon && (
          <CustomIcon
            className="toastIcon"
            width={iconSize || 16}
            height={iconSize || 16}
          />
        )}
        {message}
      </p>
      {info && <span className="toastInfo">{info}</span>}
    </div>
  );
};

const Snackbar = ({
  onClose,
  isSnackbarOpen,
  message,
  variant,
  info,
  messageClassName,
  containerClassName,
  icon,
  iconSize
}) => {
  return (
    <Toast
      message={message}
      isOpen={isSnackbarOpen}
      autoHideDuration={4000}
      onClose={onClose}
      className={cx({ Snackbar_root: variant === "error" })}
      RenderContent={RenderToastContent}
      renderContentProps={{ info, messageClassName, icon, iconSize }}
      variant={variant}
      containerClassName={containerClassName}
    />
  );
};

export default Snackbar;
