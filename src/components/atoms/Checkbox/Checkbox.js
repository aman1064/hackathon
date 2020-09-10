import React from "react";
import PropTypes from "prop-types";
import MuiCheckbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";

const CustomCheckbox = withStyles({
  root: {
    padding: "8px"
  },
  checked: {},
  colorSecondary: {
    color: "#bcc3d5",
    "&$checked": {
      color: "#ffa800"
    }
  },
  colorPrimary: {
    color: "#bcc3d5",
    "&$checked": {
      color: "#ffa800"
    }
  }
})(MuiCheckbox);

const Checkbox = ({ label, labelPlacement, labelClass, ...rest }) => (
  <FormControlLabel
    control={
      <CustomCheckbox
        {...rest}
        className={rest.checked ? "checkboxLabel isChecked" : "checkboxLabel"}
      />
    }
    label={label}
    labelPlacement={labelPlacement}
    classes={{ label: labelClass }}
  />
);

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.string
};

export default Checkbox;
