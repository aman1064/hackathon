import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import BtnLoader from "../Loader";

import "./index.scss";

const Button = ({
  children,
  Loader,
  disabled,
  loading,
  appearance,
  onClick,
  size,
  className,
  type,
  component,
  buttonType,
  ...restProps
}) => {
  const onButtonClick = e => {
    e.stopPropagation();

    if (loading || disabled) return;
    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const ButtonLoader =
    Loader ||
    (() => (
      <BtnLoader
        type="dots"
        theme={appearance === "primary" ? "light" : "dark"}
      />
    ));

  return component === "span" ? (
    <span
      type={type}
      {...restProps}
      className={cx([
        "btn",
        appearance,
        size,
        className,
        {
          loading,
          disabled
        }
      ])}
      onClick={onButtonClick}
    >
      {loading ? <ButtonLoader /> : children}
    </span>
  ) : (
    <button
      type={buttonType}
      {...restProps}
      className={cx([
        "btn",
        appearance,
        size,
        className,
        type,
        {
          loading,
          disabled
        }
      ])}
      onClick={onButtonClick}
      disabled={disabled}
    >
      {loading ? <ButtonLoader /> : children}
    </button>
  );
};

Button.defaultProps = {
  Loader: null,
  disabled: false,
  loading: false,
  appearance: "primary",
  className: "",
  size: "medium",
  type: "button",
  buttonType: "button"
};

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  appearance: PropTypes.oneOf(["primary", "secondary", "card"]),
  Loader: PropTypes.node,
  className: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  type: PropTypes.oneOf(["button", "link", "link hover", "link hasHover"]),
  component: PropTypes.string,
  buttonType: PropTypes.oneOf(["button", "submit"])
};

export default Button;
