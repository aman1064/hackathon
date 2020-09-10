import React from "react";
import MuiRadio from "@material-ui/core/Radio";
import { withStyles } from "@material-ui/core/styles";
import MuiFormControlLabel from "@material-ui/core/FormControlLabel";
import { CheckedInactiveIcon, CheckedActiveIcon } from "../../atoms/Icon/icons";

const CustomRadio = withStyles({
  root: {
    padding: "8px",
    color: "#d6dce9"
  },
  checked: {},
  colorPrimary: {
    "&$checked": {
      color: "#679efa"
    }
  }
})(MuiRadio);

const FormControlLabel = withStyles({
  labelPlacementStart: {
    marginLeft: 0,
    alignItems: "flex-start"
  }
})(MuiFormControlLabel);

const Radio = ({ value, color, label, classes, labelPlacement, ...rest }) => (
  <FormControlLabel
    value={value}
    control={
      <CustomRadio
        color={color || "primary"}
        {...rest}
        icon={<CheckedInactiveIcon size={22} viewBox="0 0 22 22" />}
        checkedIcon={<CheckedActiveIcon size={22} viewBox="0 0 22 22" />}
      />
    }
    label={label}
    labelPlacement={labelPlacement}
    classes={classes}
    className={rest.checked ? "isChecked" : ""}
  />
);

export default Radio;
