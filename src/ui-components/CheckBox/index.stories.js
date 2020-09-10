import React from "react";
import PropTypes from "prop-types";
import Checkbox from "./index";

export default { title: "Checkbox" };

const CheckedIcon = () => (
  <div
    style={{
      display: "block",
      position: "relative",
      paddingLeft: "35px",
      marginBottom: "12px",
      cursor: "pointer",
      fontSize: "22px",
      userSelect: "none"
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "5px",
        width: "5px",
        backgroundColor: "red",
        padding: "10px"
      }}
    />
    <div
      style={{
        display: "block",
        left: "9px",
        top: "5px",
        width: "5px",
        height: "10px",
        border: "solid white",
        borderWidth: "0 3px 3px 0",
        transform: "rotate(45deg)",
        content: "",
        position: "absolute"
      }}
    />
  </div>
);

const UncheckedIcon = () => (
  <div
    style={{
      display: "block",
      position: "relative",
      paddingLeft: "35px",
      marginBottom: "12px",
      cursor: "pointer",
      fontSize: "22px",
      userSelect: "none"
    }}
  >
    <span
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "25px",
        width: "25px",
        backgroundColor: "yellow",
        border: "1px solid red"
      }}
    />
  </div>
);

class CheckboxWithToggle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: false
    };
  }

  onChange = (e, params) => {
    this.setState({ checked: params.checked });
    // REMOVE: This needs to be removed
    // eslint-disable-next-line no-console
    console.log("on Checkbox Change:event", e.target.value);
    // REMOVE: This needs to be removed
    // eslint-disable-next-line no-console
    console.log("on Checkbox Change:value", params);

    if (this.props.onChange) {
      this.props.onChange(e, params);
    }
  };

  render() {
    const { checked } = this.state;
    const { children, ...restProps } = this.props;

    return (
      <Checkbox
        checkedValue="I am true"
        {...restProps}
        checked={checked}
        onChange={this.onChange}
      >
        {children}
      </Checkbox>
    );
  }
}

CheckboxWithToggle.propTypes = {
  children: PropTypes.any,
  onChange: PropTypes.func
};

CheckboxWithToggle.defaultProps = {
  children: null,
  onChange: undefined
};

export const checked = () => (
  <Checkbox
    onChange={() => {}}
    checkedValue="Javascript Checked"
    label="Javascript"
    checked
  />
);

export const unchecked = () => (
  <Checkbox
    checkedValue="Javascript Checked"
    label="Javascript"
    checked={false}
  />
);

export const disabled = () => (
  <Checkbox checkedValue="Javascript Checked" label="Javascript" disabled />
);

export const toggle = () => <CheckboxWithToggle label="Javascript" />;

export const withToggleValues = () => (
  <CheckboxWithToggle
    label="Javascript"
    unchekedValue="Javascript Unchecked"
    checkedValue="Javascript Checked"
  />
);

export const withCustomIcon = () => (
  <CheckboxWithToggle
    label="Javascript"
    CheckedIcon={CheckedIcon}
    UncheckedIcon={UncheckedIcon}
    checkedValue="Javascript"
  />
);
