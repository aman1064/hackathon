import React from "react";

import {
  CheckedInactiveIcon,
  CheckedActiveIcon
} from "../../components/atoms/Icon/icons";

const Radio = ({ name, label, value, id, classes, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`${classes.root || ""} ${checked ? "isChecked" : ""}`}
  >
    <input
      className="radioInput"
      type="radio"
      name={name}
      value={value}
      id={id}
      checked={checked}
      onChange={onChange}
    />
    <span className={classes.label || ""}>{label}</span>

    {checked ? (
      <CheckedActiveIcon size={20} />
    ) : (
      <CheckedInactiveIcon size={20} />
    )}
  </label>
);

export default Radio;
