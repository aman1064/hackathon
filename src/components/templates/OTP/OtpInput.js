import React, { Component } from "react";
import SingleOtpInput from "./SingleOtpInput";

// keyCode constants
const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;

const isStyleObject = obj => typeof obj === "object";

class OtpInput extends Component {
  static defaultProps = {
    numInputs: 4,
    isDisabled: false,
    shouldAutoFocus: false,
    value: ""
  };

  state = {
    activeInput: 0
  };

  getOtpValue = () =>
    this.props.value ? this.props.value.toString().split("") : [];

  // Helper to return OTP from input
  handleOtpChange = otp => {
    const { onChange, isInputNum } = this.props;
    const otpValue = otp.join("");
    onChange(isInputNum ? Number(otpValue) : otpValue);
  };

  // Focus on input by index
  focusInput = input => {
    const { numInputs } = this.props;
    const activeInput = Math.max(Math.min(numInputs - 1, input), 0);

    this.setState({ activeInput });
  };

  // Focus on next input
  focusNextInput = (direction) => {
    const { activeInput } = this.state;
    let nextInput;
    if(direction){
      nextInput = activeInput -1;
    }else{
      nextInput = activeInput + 1;
    }
    this.focusInput(nextInput);
  };

  // Change OTP value at focused input
  changeCodeAtFocus = value => {
    const { activeInput } = this.state;
    const otp = this.getOtpValue();
    otp[activeInput] = value[0];

    this.handleOtpChange(otp);
  };

  // Handle pasted OTP
  handleOnPaste = e => {
    e.preventDefault();
    const { numInputs } = this.props;
    const { activeInput } = this.state;
    const otp = this.getOtpValue();

    // Get pastedData in an array of max size (num of inputs - current position)
    const pastedData = this.getNumericInput(e.clipboardData
      .getData("text/plain"))
      .slice(0, numInputs - activeInput)
      .split("");

    // Paste data from focused input onwards
    for (let pos = 0; pos < numInputs; ++pos) {
      if (pos >= activeInput && pastedData.length > 0) {
        otp[pos] = pastedData.shift();
      }
    }

    this.handleOtpChange(otp);
  };

  handleOnChange = e => {
    const inputValue = this.getNumericInput(e.target.value);

    if(inputValue.length > 0) {
      this.changeCodeAtFocus(e.target.value);
      this.focusNextInput();
    }
  };

  getNumericInput = (value) => ((value || "").match(/\d+/g) || []).join("")

  // Handle cases of backspace, delete, left arrow, right arrow
  handleOnKeyDown = e => {
    if (e.keyCode === BACKSPACE || e.key === "Backspace") {
      e.preventDefault();
      this.changeCodeAtFocus("");
      this.focusNextInput("prev");
    } else if (e.keyCode === DELETE || e.key === "Delete") {
      e.preventDefault();
      this.changeCodeAtFocus("");
    } else if (e.keyCode === LEFT_ARROW || e.key === "ArrowLeft") {
      e.preventDefault();
      this.focusNextInput("prev");
    } else if (e.keyCode === RIGHT_ARROW || e.key === "ArrowRight") {
      e.preventDefault();
      this.focusNextInput();
    }
  };

  checkLength = e => {
    if (e.target.value.length > 1) {
      e.preventDefault();
      this.focusNextInput();
    }
  };

  renderInputs = () => {
    const { activeInput } = this.state;
    const {
      numInputs,
      inputStyle,
      focusStyle,
      separator,
      isDisabled,
      disabledStyle,
      hasErrored,
      errorStyle,
      shouldAutoFocus,
      isInputNum
    } = this.props;
    const otp = this.getOtpValue();
    const inputs = [];

    for (let i = 0; i < numInputs; i++) {
      inputs.push(
        <SingleOtpInput
          key={i}
          focus={activeInput === i}
          value={otp && otp[i]}
          onChange={this.handleOnChange}
          onKeyDown={this.handleOnKeyDown}
          onInput={this.checkLength}
          onPaste={this.handleOnPaste}
          onFocus={e => {
            this.setState({ activeInput: i });
            e.target.select();
          }}
          onBlur={() => this.setState({ activeInput: -1 })}
          separator={separator}
          inputStyle={inputStyle}
          focusStyle={focusStyle}
          isLastChild={i === numInputs - 1}
          isDisabled={isDisabled}
          disabledStyle={disabledStyle}
          hasErrored={hasErrored}
          errorStyle={errorStyle}
          shouldAutoFocus={shouldAutoFocus}
          isInputNum={isInputNum}
        />
      );
    }

    return inputs;
  };

  render() {
    const { containerStyle } = this.props;

    return (
      <div
        style={Object.assign(
          { display: "flex" },
          isStyleObject(containerStyle) && containerStyle
        )}
        className={!isStyleObject(containerStyle) && containerStyle}
      >
        {this.renderInputs()}
      </div>
    );
  }
}

export default OtpInput;
