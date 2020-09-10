/* eslint-disable array-callback-return */
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import OtherIcon from "../../atoms/Icon/iconsList/Other.svg";

import ReduxField from "../../organisms/Field";
import Button from "../../atoms/Button";
import PageHeading from "../../atoms/PageHeading";
import HelpText from "../../atoms/HelpText";
import Checkbox from "../../../ui-components/CheckBox";
// import Checkbox from "../../atoms/Checkbox";
import { trackCleverTap } from "../../../utils/tracking";
import TncLink from "../../atoms/TncLink";
import tracker from "../../../analytics/tracker";
import BaseInput from "../../../ui-components/BaseInput";

export const renderField = ({
  input,
  type,
  customClass = "",
  showPassword,
  label,
  className,
  ctcValue,
  QACtcValue,
  jsonKey,
  handleClickShowPassword,
  labelClass,
  checkboxClass,
  meta: { touched, error, warning },
  ...rest
}) => {
  let field;
  switch (type) {
    case "checkbox":
      if (jsonKey === "isCTCConfidential") {
        field = (
          <Checkbox
            type={type}
            label={label}
            {...input}
            {...rest}
            checked={input.value}
            labelClass={`${labelClass} fontSize_13`}
            onClick={() => {
              tracker().on("event", {
                hitName:
                  "registration$confidential_salary_clicked$company_details"
              });
              trackCleverTap("reg_HideCTC_companydetails");
            }}
          />
        );
      } else {
        field = (
          <Checkbox
            type={type}
            label={label}
            {...input}
            {...rest}
            checked={input.value}
            labelClass={` ${checkboxClass} fontSize_15`}
            onClick={() => {
              tracker().on("event", {
                hitName:
                  "registration$confidential_salary_clicked$company_details"
              });
              trackCleverTap("reg_HideCTC_companydetails");
            }}
          />
        );
      }

      break;
    default:
      field = (
        <BaseInput
          type={type}
          error={touched && typeof error === "string"}
          label={label}
          labelClassName={`${rest.InputLabelProps &&
            rest.InputLabelProps.className} blue_grey_InputLabel`}
          containerClassName={`${className} blue_grey_Input`}
          {...input}
          maxLength={50}
          inputClassName={"blue_grey_InputBorder"}
          placeholder={rest.placeholder}
          {...rest}
        />
      );
  }
  return (
    <div className={customClass}>
      {field}
      {touched &&
        ((error && <span className="formError inline_error">{error}</span>) ||
          (warning && <span className="color_yellow">{warning}</span>))}
    </div>
  );
};

export const renderButton = ({
  submitButtonText,
  customClass = "",
  isFormInvalid,
  isTextButton,
  handleBackClick,
  variant,
  type,
  ...rest
}) => {
  return isTextButton ? (
    <div className={`js_submit_button_wrapper ${customClass}`}>
      <Button
        {...rest}
        buttonType="submit"
        disabled={isFormInvalid}
        type="button"
      >
        {submitButtonText || "Submit"}
      </Button>
    </div>
  ) : (
    <div className={`js_submit_button_wrapper spreadHr ${customClass}`}>
      {typeof handleBackClick === "function" ? (
        <Button
          type="link hasHover"
          {...rest}
          onClick={handleBackClick}
          id="formPrevButton"
        >
          <span className="nav_arrow prev">{""}</span>
        </Button>
      ) : (
        <div>{""}</div>
      )}
      <Button
        type="link hasHover"
        {...rest}
        buttonType="submit"
        disabled={isFormInvalid}
        id="formNextButton"
      >
        <span className={`nav_arrow secondary `}>{""}</span>
      </Button>
    </div>
  );
};
const getFormFields = (
  { formFields, button },
  error,
  handleClickShowPassword,
  isFormInvalid,
  ctcValue,
  history,
  dependentFieldValue,
  QACtcValue,
  animateOnFocus,
  handleBackClick,
  initialValues
) => {
  return (
    <Fragment>
      {formFields.map((formFieldObj, i) => {
        const formField = Object.assign({}, formFieldObj);
        formField.initialValue = initialValues[formField.name];
        delete formField.isoptional;

        if (!formField.isDependent || dependentFieldValue) {
          // eslint-disable-next-line default-case
          switch (formField.type) {
            case "text":
            case "password":
            case "checkbox":
            case "number":
            case "tel":
            case "email":
              return (
                <ReduxField
                  key={i}
                  {...formField}
                  handleClickShowPassword={handleClickShowPassword}
                  component={renderField}
                  ctcValue={ctcValue}
                  QACtcValue={QACtcValue}
                />
              );
            case "component":
              formField.history = history;
              return (
                <div className={formField.wrapperClass} key={i}>
                  <ReduxField
                    key={i}
                    {...formField}
                    dependentFieldValue={
                      dependentFieldValue && dependentFieldValue.id
                    }
                    component={formField.component}
                  />
                </div>
              );
            case "textGroup":
              return (
                <div className={formField.wrapperClass} key={i}>
                  {formField.childFields.map((fieldData, i) => {
                    delete formField.isoptional;
                    return (
                      <ReduxField
                        key={`${fieldData.id}${i}`}
                        {...fieldData}
                        component={renderField}
                      />
                    );
                  })}
                </div>
              );
            case "heading":
              return (
                <PageHeading
                  key={i}
                  title={
                    dependentFieldValue ? (
                      formField.label.replace(
                        "{specialization}",
                        dependentFieldValue && dependentFieldValue.name
                      )
                    ) : (
                      formField.label
                    )
                  }
                  className={formField.className}
                  el={formField.el}
                />
              );

            case "helpText":
              return (
                <HelpText
                  key={i}
                  text={formField.label}
                  className={formField.className}
                />
              );
            case "textLink":
              return (
                <TncLink
                  key={i}
                  redirectTo={formField.redirectTo}
                  className={formField.className}
                  customClass={formField.customClass}
                />
              );

            case "textButton":
              return (
                <div className={formField.className} key={i}>
                  <Button
                    type="text"
                    appearance="secondary"
                    component={Link}
                    to={formField.redirectTo}
                    className={formField.customClass}
                    onClick={() => {
                      tracker().on("event", { hitName: formField.gaEventName });
                    }}
                  >
                    {formField.label}
                  </Button>
                </div>
              );
            case "image":
              return (
                <img
                  height="200"
                  src={OtherIcon}
                  alt="no apply icon"
                  className="marginTop_142"
                />
              );
          }
        }
      })}
      {error && <p className="formError textCenter bottomError">{error}</p>}
      {button && (
        <ReduxField
          {...button}
          isFormInvalid={isFormInvalid}
          handleBackClick={handleBackClick}
          component={renderButton}
        />
      )}
    </Fragment>
  );
};
const Form = props => {
  const {
    error,
    onSubmit: handleSubmit,
    config,
    ctcValue,
    QACtcValue,
    handleBackClick,
    handleClickShowPassword,
    history,
    config: { container: { className } },
    inspectletName,
    isValid,
    dependentFieldValue,
    initialValues
  } = props;
  let animateOnFocus = true;
  const invalid = !isValid;

  config.formFields.map(formField => {
    if (formField.name && formField.name.indexOf("password") !== -1) {
      formField.showPassword = props.showPassword;
    }
    return formField;
  });
  if (className && className.includes("quickRegistration")) {
    animateOnFocus = false;
  }
  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      noValidate="novalidate"
      id={inspectletName}
      autoComplete="off"
    >
      {config.name &&
        getFormFields(
          config,
          error,
          handleClickShowPassword,
          invalid,
          ctcValue,
          history,
          dependentFieldValue,
          QACtcValue,
          animateOnFocus,
          handleBackClick,
          initialValues
        )}
    </form>
  );
};

export default Form;
