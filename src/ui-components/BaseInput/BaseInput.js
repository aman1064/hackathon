import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./BaseInput.scss";

/**
 * Possible input class can be
 *
 * error active leftPadding rightPadding $inputClassName
 *
 */
const BaseInput = props => {
  const onLeftIconClick = () => {
    if (props.disabled || !props.onLeftIconClick) return;
    props.onLeftIconClick();
  };

  const onRightIconClick = () => {
    if (props.disabled || !props.onRightIconClick) return;
    props.onRightIconClick();
  };

  const {
    leftIconNode,
    rightIconNode,
    leftIconClassName,
    rightIconClassName,
    containerClassName,
    className,
    inputClassName,
    disabled,
    error,
    value,
    label,
    placeholder,
    inputWrapperClass,
    setRef,
    labelClassName,
    ...restInputProps
  } = props;
  return (
    <div className={`inputWrapper ${inputWrapperClass}`}>
      {leftIconNode && (
        <span
          className={cx("leftIcon", leftIconClassName, {
            disable: disabled,
            error
          })}
          onClick={onLeftIconClick}
        >
          {leftIconNode}
        </span>
      )}

      <div className={containerClassName}>
        <input
          ref={setRef}
          {...restInputProps}
          className={cx([
            {
              error,
              active: !!value,
              noFloatLabel: !label,
              leftPadding: !!leftIconNode,
              rightPadding: !!rightIconNode
            },
            inputClassName
          ])}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
        />
        {label && (
          <label
            htmlFor="input"
           // className ={`label ${labelClassName}`}
            className={cx("label", labelClassName, {
              leftPadding: !!leftIconNode,
              rightPadding: !!rightIconNode
            })}
          >
            {label}
          </label>
        )}
      </div>
      {rightIconNode && (
        <span
          className={cx("rightIcon", rightIconClassName, {
            disable: disabled,
            error
          })}
          onClick={onRightIconClick}
        >
          {rightIconNode}
        </span>
      )}
    </div>
  );
};

BaseInput.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  error: PropTypes.bool,
  label: PropTypes.string,
  containerClassName: PropTypes.string,
  inputWrapperClass: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  leftIconClassName: PropTypes.string,
  rightIconClassName: PropTypes.string,
  onLeftIconClick: PropTypes.func,
  onRightIconClick: PropTypes.func,
  leftIconNode: PropTypes.node,
  rightIconNode: PropTypes.number,
  setRef: PropTypes.func
};

BaseInput.defaultProps = {
  disabled: false,
  value: undefined,
  error: false,
  label: "",
  containerClassName: "",
  inputWrapperClass: "",
  inputClassName: "",
  labelClassName: "",
  leftIconClassName: "",
  rightIconClassName: "",
  setRef: () => {},

  leftIconNode: null,
  rightIconNode: null
};

export default BaseInput;
