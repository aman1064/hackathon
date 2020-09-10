import React from "react";

import Button from "../../../../ui-components/Button";
import ReduxField from "../../../organisms/Field";

const SignupForm = ({ onSubmit, isValid, errorMessage, config }) => (
  <form onSubmit={onSubmit} className="signupViewForm" noValidate>
    {config.formFields.map((formField, index) => (
      <div className="marginBottom_32" key={index}>
        <ReduxField
          name={formField.name}
          label={formField.label}
          id={formField.id}
          type={formField.type}
          normalize={formField.normalize}
          {...config.common}
        />
      </div>
    ))}

    {errorMessage && (
      <p className="formError textCenter bottomError">{errorMessage}</p>
    )}
    <div className="js_submit_button_wrapper textCenter fixedToBottom">
      <Button
        buttonType="submit"
        className="submit_button"
        disabled={!isValid}
        id="signup_btn"
      >
        Get Started
      </Button>
    </div>
    <div className="undefined fontSize_11 color_dusk textCenter tncLink paddingTop_7">
      <p>
        By continuing, you agree to the{" "}
        <a
          href="https://www.bigshyft.com/policies/index.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline cursor_pointer"
        >
          T&amp;C
        </a>
      </p>
    </div>
  </form>
);

export default SignupForm;
