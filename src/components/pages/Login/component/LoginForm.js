import React from "react";

import Button from "../../../../ui-components/Button";
import ReduxField from "../../../organisms/Field";
import FormField from "../../../molecules/FormField";

import {
  fieldRequiredError,
  onlyNumbers
} from "../../../templates/Form/Validate";

const LoginForm = ({ onSubmit, isValid, errorMessage }) => (
  <form onSubmit={onSubmit}>
    <div className="marginBottom_32">
      <ReduxField
        name="mobileNumber"
        label="Mobile number"
        placeholder="Enter 10 Digit Mobile Number"
        form="login"
        component={FormField}
        validate={fieldRequiredError}
        normalize={onlyNumbers(10)}
        maxLength={10}
        id="mobileNumber"
        type="tel"
      />
    </div>
    {errorMessage && (
      <p className="formError textCenter bottomError">{errorMessage}</p>
    )}
    <div className="js_submit_button_wrapper LoginView__CTA">
      <Button
        buttonType="submit"
        className="submit_button"
        disabled={!isValid}
        id="loginButton"
      >
        Login
      </Button>
    </div>
  </form>
);

export default LoginForm;
