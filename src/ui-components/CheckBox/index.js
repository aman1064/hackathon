/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import DefaultCheckBoxIcon from "./CheckBoxIcon";
import "./index.scss";

class CheckBox extends PureComponent {
  onChange = e => {
    if (this.props.disabled) return;

    if (this.props.onChange) {
      const { value, checked } = this.props;
      this.props.onChange(e, { checked: !checked, value });
    }
    if(this.props.onClick){
      this.props.onClick()
    }
  };

  render() {
    const {
      size,
      label,
      checked,
      disabled,
      appearance,
      inputClass,
      inputStyles,
      CheckedIcon,
      UncheckedIcon,
      labelPlacement,
      labelClassName,
      iconContainerClass,
      containerClassName,
      checkedIconClassName,
      uncheckedIconClassName,
      inputContainerClassName,
      disabledClass
    } = this.props;

    const iconProps = {
      checked,
      disabled,
      className: checked ? checkedIconClassName : uncheckedIconClassName
    };

    const checkboxLabel = label && (
      <span className={cx(["label", labelClassName])}>{label}</span>
    );

    return (
      <>
        <label
          className={cx([
            appearance,
            size,
            "checkbox",
            { cntrDisabled: disabled },
            containerClassName,
            disabled ? disabledClass : ""
          ])}
        >
          {labelPlacement === "start" && checkboxLabel}
          <span className={cx(["inputContainer", inputContainerClassName])}>
            <input
              type="checkbox"
              disabled={disabled}
              style={inputStyles}
              className={cx([
                "input",
                { inputHidden: !!(CheckedIcon || UncheckedIcon) },
                { disabled },
                inputClass
              ])}
              checked={checked}
              onChange={this.onChange}
            />

            <span
              className={cx([
                "icon",
                { iconDisabled: disabled },
                iconContainerClass
              ])}
            >
              {checked && CheckedIcon && <CheckedIcon {...iconProps} />}
              {!checked && UncheckedIcon && <UncheckedIcon {...iconProps} />}
            </span>
          </span>
          {labelPlacement === "end" && checkboxLabel}
        </label>
      </>
    );
  }
}

CheckBox.propTypes = {
  labelClassName: PropTypes.string,
  iconContainerClass: PropTypes.string,
  containerClassName: PropTypes.string,
  CheckedIcon: PropTypes.func,
  UncheckedIcon: PropTypes.func,
  checkedIconClassName: PropTypes.string,
  uncheckedIconClassName: PropTypes.string,
  inputContainerClassName: PropTypes.string,
  inputStyles: PropTypes.object,
  inputClass: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.any.isRequired,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  onChange: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  appearance: PropTypes.oneOf(["primary", "secondary"]),
  labelPlacement: PropTypes.oneOf(["start", "end"])
};

CheckBox.defaultProps = {
  CheckedIcon: DefaultCheckBoxIcon,
  UncheckedIcon: DefaultCheckBoxIcon,
  labelClassName: "",
  iconContainerClass: "",
  containerClassName: "",
  checkedIconClassName: "",
  uncheckedIconClassName: "",
  inputContainerClassName: "",
  inputStyles: {},
  disabled: false,
  inputClass: "",
  checked: false,
  label: "",
  size: "medium",
  appearance: "primary",
  labelPlacement: "end"
};

export default CheckBox;
