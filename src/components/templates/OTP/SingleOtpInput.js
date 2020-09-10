import React, { Component } from "react";
import PropTypes from "prop-types";
const isStyleObject = obj => typeof obj === "object";
class SingleOtpInput extends Component {
  // Focus on first render
  // Only when shouldAutoFocus is true
  componentDidMount() {
    const { input, props: { focus, shouldAutoFocus } } = this;

    if (input && focus && shouldAutoFocus) {
      input.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const { input, props: { focus } } = this;

    // Check if focusedInput changed
    // Prevent calling function if input already in focus
    if (prevProps.focus !== focus && (input && focus)) {
      input.focus();
      input.select();
    }
  }

  getClasses = (...classes) =>
    classes.filter(c => !isStyleObject(c) && c !== false).join(" ");

  render() {
    const {
      separator,
      isLastChild,
      inputStyle,
      focus,
      isDisabled,
      hasErrored,
      errorStyle,
      focusStyle,
      disabledStyle,
      shouldAutoFocus,
      isInputNum,
      value,
      ...rest
    } = this.props;

    const numValueLimits = isInputNum ? { min: 0, max: 9 } : {};

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <input
          placeholder="0"
          type="tel"
          style={Object.assign(
            { width: "1em", textAlign: "center" },
            isStyleObject(inputStyle) && inputStyle,
            focus && isStyleObject(focusStyle) && focusStyle,
            isDisabled && isStyleObject(disabledStyle) && disabledStyle,
            hasErrored && isStyleObject(errorStyle) && errorStyle
          )}
          className={this.getClasses(
            inputStyle,
            focus && focusStyle,
            isDisabled && disabledStyle,
            hasErrored && errorStyle
          )}
          type={isInputNum ? "number" : "tel"}
          {...numValueLimits}
          maxLength="1"
          ref={input => {
            this.input = input;
          }}
          disabled={isDisabled}
          value={value ? value : ""}
          {...rest}
        />
        {!isLastChild && separator}
      </div>
    );
  }
}
SingleOtpInput.propTypes = {
  focus: PropTypes.bool,
  shouldAutoFocus: PropTypes.bool
};

export default SingleOtpInput;
