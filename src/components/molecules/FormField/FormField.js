import React from "react";

import BaseInput from "../../../ui-components/BaseInput";

const FormField = ({
  hasWrapper = true,
  className,
  wrapperClass,
  InputLabelProps,
  input,
  type,
  meta: { touched, error },
  ...rest
}) => {
  const inputField = (
    <BaseInput
      type={type}
      error={touched && typeof error === "string"}
      className={`fontSize_13 blue_grey_Input fullWidth marginBottom_20 ${className}`}
      containerClassName={`${className} blue_grey_Input`}
      {...input}
      maxLength={50}
      inputClassName={"blue_grey_InputBorder"}
      {...rest}
    />
  );
  return hasWrapper ? (
    <div className={`formfield_wrapper ${wrapperClass}`}>
      {inputField}
      {touched && error && <p className="formError inline_error">{error}</p>}
    </div>
  ) : (
    <React.Fragment>
      {inputField}
      {touched && error && <p className="formError inline_error">{error}</p>}
    </React.Fragment>
    
  );
};

export default FormField;
