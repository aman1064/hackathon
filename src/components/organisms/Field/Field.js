/* eslint-disable no-shadow */
/* eslint-disable react/prop-types */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  handleChangeData,
  handleFormValidState,
  handleFieldError
} from "./saga/ActionCreator";
import globalConfig from "../../../configs/globalConfig";
import get from "../../../utils/jsUtils/get";

class Field extends PureComponent {
  componentDidMount() {
    const {
      validate,
      form,
      value,
      name,
      formErrors,
      formValues = {},
      formDesc = "",
      touched,
      initialValue,
      profile,
      handleFormValidState,
      handleChangeData,
      error
    } = this.props;
    let formError = error || false;
    if (typeof form === "undefined") {
      return handleFormValidState({ form, isValid: false });
    }
    if (formDesc.toLowerCase().includes("skill selection") && profile.skills) {
      handleFormValidState({ form, isValid: true });
    } else if (
      formDesc.toLowerCase().includes("skill selection") &&
      !profile.skills
    ) {
      return handleFormValidState({ form, isValid: false });
    }
    if (!touched) {
      formValues[name] = initialValue;
    }
    if (validate) {
      formError = validate(
        value || (!touched && initialValue) || "",
        formValues
      );
    }
    if (form === "createJsForm") {
      handleChangeData({
        form,
        fieldName: name,
        value: value || initialValue || "",
        error, // error || get(formErrors, name),
        touched
      });
    } else {
      // to fill `forms.${formName}.values.${fieldName}`
      // eazy to iterate and get all the fields of a form
      handleChangeData({
        form,
        fieldName: name,
        value: value || (!touched && initialValue) || "",
        error: false, // error || get(formErrors, name),
        touched
      });
    }
    // to enable/disable submit button of form
    if (formError || get(formErrors, name)) {
      handleFormValidState({ form, isValid: false });
    } else if (!this.getFormValidState()) {
      return handleFormValidState({ form, isValid: false });
    }else {
    return handleFormValidState({ form, isValid: true });
    }
  }

  handleChange = (e, val) => {
    const {
      onChange,
      validate,
      form,
      name,
      normalize,
      value: preValue,
      formValues = {},
      fieldType,
      handleChangeData
    } = this.props;
    let value = get(e, "target") ? get(e, "target.value") : e; // for custom field components like chips
    if (fieldType === "checkbox") {
      value = val.checked;
    }
    let error;
    const _formValues = JSON.parse(JSON.stringify(formValues));

    if (value && normalize) {
      value = normalize(value, preValue) || preValue;
    }

    _formValues[name] = value || "";

    if (onChange) {
      onChange(value, preValue);
    }

    if (validate) {
      error = validate(value, _formValues);
    }
    

    // update the formfield
    handleChangeData({
      value,
      form,
      error,
      fieldName: name,
      touched: true
    });

    // validate form
    this.validateFormOnFieldChange(error);
  };

  validateFormOnFieldChange = error => {
    const { handleFormValidState, form } = this.props;
    if (error) {
      // if current field has error
      handleFormValidState({ form, isValid: false });
    } else {
      // if current field is valid
      const _isValid = this.getFormValidState();
      handleFormValidState({ form, isValid: _isValid });
    }
  };

  getFormValidState = () => {
    const { formValues, validateObj = {}, validate } = this.props;
    let _isValid = true;
    for (const field in formValues) {
      // iterate over all fields
      // to check form validity
      if (Object.prototype.hasOwnProperty.call(formValues, field)) {
        if (validateObj[field]) {
          // if fields of a form has different validation
          if (validateObj[field](formValues[field], formValues)) {
            _isValid = false;
            break;
          }
        } else if (validate) {
          // if fields of a form has same validation
          if (validate(formValues[field], formValues)) {
            _isValid = false;
            break;
          }
        }
      }
    }
    return _isValid;
  };

  handleBlur = e => {
    const {
      onBlur,
      validate,
      handleFieldError,
      form,
      name,
      normalize,
      value: preValue,
      formValues = {}
    } = this.props;
    let value = get(e, "target") ? get(e, "target.value") : e; // for custom field components like chips
    const _formValues = JSON.parse(JSON.stringify(formValues));
    let error = false;
    if (value && normalize) {
      value = normalize(value, preValue) || preValue;
    }

    _formValues[name] = value || "";

    if (onBlur) {
      onBlur(value);
    }

    if (validate) {
      error = validate(value, _formValues);
    }
    if (!value) {
      error = true;
    }
    if (error) {
      handleFieldError({
        value,
        form,
        errorMsg: !value
          ? globalConfig.mandatoryValueMissing
          : globalConfig.FORM_ERRORS[name],
        field: name,
        touched: true
      });
    }
  };

  render() {
    const {
      component: Component,
      name,
      label,
      value,
      error,
      touched,
      form,
      passFormNameToChild,
      fieldType,
      showErrorOnBlur,
      ...rest
    } = this.props;
    const compProps = {
      input: {
        name,
        value,
        onChange: this.handleChange,
        label
      },
      meta: {
        touched,
        error
      },
      fieldType,
      ...rest
    };
    if (passFormNameToChild) {
      compProps.form = form;
    }
    if (showErrorOnBlur) {
      compProps.input.onBlur = this.handleBlur;
    }
    return <Component {...compProps} />;
  }
}

Field.propTypes = {
  formValues: PropTypes.object,
  validateObj: PropTypes.object,
  form: PropTypes.string,
  name: PropTypes.string,
  initialValue: PropTypes.any,
  profile: PropTypes.object,
  value: PropTypes.any,
  formErrors: PropTypes.object,
  // normalize: PropTypes.func,
  // label: PropTypes.any,
  passFormNameToChild: PropTypes.bool,
  component: PropTypes.func,
  validate: PropTypes.func,
  handleFormValidState: PropTypes.func,
  // error: PropTypes.bool,
  // touched: PropTypes.bool,
  formDesc: PropTypes.string,
  handleChangeData: PropTypes.func,
  // onChange: PropTypes.func,
  fieldType: PropTypes.string
};

Field.defaultProps = {
  formValues: {},
  validateObj: {},
  form: "",
  name: "",
  initialValue: "",
  profile: {},
  value: "",
  formErrors: {},
  // normalize: () => {},
  // label: "",
  passFormNameToChild: false,
  component: () => {},
  validate: () => {},
  handleFormValidState: () => {},
  // error: false,
  // touched: false,
  formDesc: "",
  handleChangeData: () => {},
  // onChange: () => {},
  fieldType: ""
};

const mapStateToProps = (reduxState, ownProps) => {
  return {
    value: get(reduxState, `forms.${ownProps.form}.values.${ownProps.name}`),
    error: get(reduxState, `forms.${ownProps.form}.errors.${ownProps.name}`),
    touched: get(reduxState, `forms.${ownProps.form}.touched.${ownProps.name}`),
    isFormValid: get(reduxState, `forms.${ownProps.form}.isValid`),
    formValues: get(reduxState, `forms.${ownProps.form}.values`),
    formErrors: get(reduxState, `forms.${ownProps.form}.errors`),
    profile: reduxState.commonData.userDetails.profile
  };
};

const mapDispatchToProps = {
  handleChangeData,
  handleFormValidState,
  handleFieldError
};

export default connect(mapStateToProps, mapDispatchToProps)(Field);
