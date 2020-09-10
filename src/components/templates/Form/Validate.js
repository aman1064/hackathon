import globalConfig from "../../../configs/globalConfig";
import getRegexFuc from "../../../utils/getRegexFun";
import tracker from "../../../analytics/tracker";

import Store from "../../../store/Store";
import {
  handleFormValidState,
  handleFieldError
} from "../../organisms/Field/saga/ActionCreator";

export const validateForm = (formFieldsArr, value, customFormName) => {
  let jsonKey, _error;
  const errors = formFieldsArr.reduce((acc, formField) => {
    if (formField.id === "experience") {
      formField.childFields.reduce((acc, childField) => {
        if (
          childField.regexstr &&
          fieldValidationError(
            value[childField.name],
            childField.regexstr,
            childField.isoptional
          )
        ) {
          _error = fieldValidationError(
            value[childField.name],
            childField.regexstr,
            childField.isoptional
          );
        }
        return acc;
      }, acc);
    } else {
      if (
        formField.regexstr &&
        fieldValidationError(
          value[formField.name],
          formField.regexstr,
          formField.isoptional
        )
      ) {
        if (formField.name.includes("latestEducationDetails$yearOfPassing")) {
          tracker().on("event", {
            hitName: "registration$graduation_year_error$highest_education"
          });
        } else {
          const gaEventName = `$registration$${formField.name.split(
            "$"
          )[1]}_error$${formField.name.split("$")[0]}_screen`;

          tracker().on("event", {
            hitName: gaEventName
          });
        }
        jsonKey = formField.name.includes("$")
          ? formField.name.split("$")[1]
          : formField.name;
        acc[formField.name] = `${globalConfig.FORM_ERRORS[jsonKey]}`;
      }
    }
    return acc;
  }, {});
  if (Object.keys(errors).length || _error) {
    if (customFormName) {
      handleCustomFormError(customFormName, errors, _error,true);
    } else {
      console.error("customFormName not provided in validateForm");
    }
  } else {
    return true;
  }
};

export const handleCustomFormError = (customFormName, errors, _error = "",touched) => {
  Store.dispatch(
    handleFormValidState({
      form: customFormName,
      isValid: false,
      errorMsg: _error
    })
  );

  for (const field in errors) {
    if (errors.hasOwnProperty(field)) {
      Store.dispatch(
        handleFieldError({
          form: customFormName,
          field,
          errorMsg: errors[field],
          touched:touched ? true : false
        })
      );
    }
  }
};
export const handleCustomFieldError = (customFormName, errors, _error = "",touched) => {
  for (const field in errors) {
    if (errors.hasOwnProperty(field)) {
      Store.dispatch(
        handleFieldError({
          form: customFormName,
          field,
          errorMsg: errors[field],
          touched: touched ? true : false
        })
      );
    }
  }
};
export const fieldValidationError = (value, regexstr, isoptional = false) => {
  let regex = new RegExp(globalConfig.REGEX_FORM_VALIDATION_FROM_CONFIG);
  if (regex.test(regexstr)) {
    return globalConfig.validateFn[regexstr](value);
  } else if (!value) {
    return isoptional ? false : true;
  } else {
    regex = new RegExp(regexstr);
    return !regex.test(value);
  }
};
export const mobileValidationError = value => !(value && value.length > 9);

export const fieldRequiredError = value =>
  !value || (value.trim && value.trim() === "") ? true : false;

  export const ctcRequiredError = value => 
  typeof(value)=== "undefined"|| (value.trim && value.trim() === "") ? true : false;

export const fieldRequiredErrorWithHighlight = value => {
  if (Array.isArray(value)) {
    let isButtonEnabled = false;
    for (let i = 0; i < value.length; i++) {
      isButtonEnabled =
        ![NaN, 0].includes(value[i].experienceYear) ||
        ![NaN, 0].includes(value[i].experienceMonth)
          ? true
          : false;
      if (!isButtonEnabled) {
        break;
      }
    }
    if (isButtonEnabled) {
      return false;
    } else {
      return " ";
    }
  } else {
    return !value ? " " : false;
  }
};

export const onlyNumbers = maxLength => value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= maxLength) {
    return onlyNums;
  }
};

export const normalizeGraduationYear = maxLength => (value, previousValue) => {
  if (!value) {
    return value;
  }
  const splitValue = value.split(".");
  if (splitValue[1] && splitValue[1].length > 2) {
    value = `${splitValue[0]}.${splitValue[1].substr(0, 2)}`;
  }
  value = value && value <= (`${new Date().getFullYear() + 5}`) && value >= 0 ? value : previousValue;
  if (value && value.length <= maxLength) {
    return value;
  }
}
export const normalizeMobileNumber = maxLength => (value, previousValue) => {
  if (!value) {
    return value;
  }
  let mobileNumbers = value.replace(/[^+\d]/g, "");
  mobileNumbers = mobileNumbers ? mobileNumbers : previousValue;
  if (mobileNumbers && mobileNumbers.length <= maxLength) {
    return mobileNumbers;
  }
};

export const decimalNumbers = maxLength => (value, previousValue) => {
  if (!value) {
    return value;
  }
  const splitValue = value.split(".");
  if (splitValue[1] && splitValue[1].length > 2) {
    value = `${splitValue[0]}.${splitValue[1].substr(0, 2)}`;
  }
  value = value && value <= 999.99 && value >= 0 ? value : previousValue;
  if (value && value.length <= maxLength) {
    return value;
  }
};
export const onlyChar = maxLength => (value, previousValue) => {
  if (!value) {
    return value;
  }
  const regex = /^[a-zA-Z_ ]*$/;
  let onlyChar;
  if (regex.test(value)) {
    onlyChar = value;
  } else {
    onlyChar = previousValue;
  }
  if (onlyChar.length <= maxLength) {
    return onlyChar;
  }
};
export const normalizeNameField = maxLength => (value, previousValue) => {
  if (!value) {
    return value;
  }
  const regex = /^[a-zA-Z .-]+$/;
  let nameValue;
  if (regex.test(value)) {
    nameValue = value;
  } else {
    nameValue = previousValue;
  }
  if (nameValue && nameValue.length <= maxLength) {
    return nameValue;
  }
};
export const normalizeSingleSuggester = (regexstr, maxLength) => (
  value,
  previousValue
) => {
  if (!value.name) {
    return value;
  }
  const validateRegexFun = getRegexFuc(regexstr);
  let suggesterValue = value;
  if (!validateRegexFun(suggesterValue.name) && regexstr) {
    suggesterValue = previousValue;
  }
  // when the first character is invalid
  if (!suggesterValue || !suggesterValue.name) {
    return { name: "", id: null };
  }
  if (suggesterValue.name.length <= maxLength) {
    return suggesterValue;
  }
};

export const normalizeField = (regexstr, maxLength) => (value, preValue) => {
  if (!value) {
    return value;
  }
  const validateRegexFun = getRegexFuc(regexstr);
  let _val = value;
  if (regexstr && !validateRegexFun(_val)) {
    _val = preValue;
  }
  if (_val && _val.length <= maxLength) {
    return _val;
  } else {
    return preValue;
  }
};

export const normalizeMonths = maxLength => value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= maxLength && onlyNums < 12) {
    return onlyNums;
  }
};
export const normalizeYears = maxLength => value => {
  if (!value) {
    return value;
  }
  const onlyNums = value.replace(/[^\d]/g, "");
  if (onlyNums.length <= maxLength && onlyNums < 50) {
    return onlyNums;
  }
};

export const emailValidationField = value => !!emailValidation(value);
export const nameValidationField = value => {
  return value && !/^[a-zA-Z .-]+$/i.test(value) ? "Invalid Name" : undefined
}

export const emailValidation = value =>
  value &&
  !/^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,10}$/i.test(
    value
  )
    ? "Invalid email address"
    : undefined;

export const experienceFieldError = (value, allValues) => {
  if (allValues.domain && allValues.domain.name === "Others") {
    return false;
  } else {
    return (allValues.experienceYear && allValues.experienceYear > 0) ||
    (allValues.experienceMonth && allValues.experienceMonth > 0)
      ? false
      : true;
  }
};

export const quickApplyExperienceFieldError = (value, allValues) =>
  (allValues.experienceYear && allValues.experienceYear > 0) ||
  (allValues.experienceMonth && allValues.experienceMonth > 0)
    ? false
    : true;

export const fieldRequiredErrorInDomain = (value, allValues) => {
  if (allValues.domain && allValues.domain.name === "Others") {
    return false;
  } else {
    return fieldRequiredError(value);
  }
};

export const fieldRequiredErrorInOtherDomain = (value, allValues) => {
  if (allValues.domain && allValues.domain.name !== "Others") {
    return false;
  } else {
    return fieldRequiredError(value);
  }
};

export const normalizeName = maxLength => value => {
  if (!value) {
    return value;
  }
  const onlyChar = value.replace(/[^A-Za-z .-]/g, "");
  if (onlyChar.length <= maxLength ) {
    return onlyChar;
  }
}
