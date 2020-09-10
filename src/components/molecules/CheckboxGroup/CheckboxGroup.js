import React from "react";
import PropTypes from "prop-types";

import Checkbox from "../../../ui-components/CheckBox";

const CheckboxGroup = ({
  legend,
  checkboxData,
  labelPlacement,
  onChange,
  checkedState,
  className,
  uncheckedIconClassName,
  checkedIconClassName
}) => (
  <div className="fullWidth">
    {legend && <legend>{legend}</legend>}
    <div className={className}>
      {checkboxData.map((item, i) => (
        <Checkbox
          label={item.name}
          value={item.id}
          onChange={onChange(
            item.id,
            item.name,
            checkedState[item.id] || false
          )}
          checkedIconClassName={checkedIconClassName}
          uncheckedIconClassName={uncheckedIconClassName}
          checked={checkedState[item.id] || false}
          name={checkedState.name}
          labelClassName="checkboxLabel"
          color="primary"
          id={`checkBox_${i}`}
          checkedValue={checkedState[item.id] || false}
          labelPlacement={labelPlacement}
          key={i}
        />
      ))}
    </div>
  </div>
);

CheckboxGroup.propTypes = {
  checkboxData: PropTypes.array.isRequired
};
export default CheckboxGroup;
