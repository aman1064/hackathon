import React from "react";
import { connect } from "react-redux";

import Button from "../../../../../atoms/Button";
import ReduxField from "../../../../../organisms/Field";
import FormField from "../../../../../molecules/FormField";
// import SingleSuggester from "../../../../../templates/SingleSuggester/SingleSuggester";

import {
  fieldRequiredError,
  emailValidationField,
  onlyNumbers,
  mobileValidationError,
  normalizeMonths,
  normalizeYears,
  experienceFieldError,
  normalizeNameField,
  handleCustomFormError,
  decimalNumbers
} from "../../../../../templates/Form/Validate";
import globalConfig from "../../../../../../configs/globalConfig";
import UrlConfig from "../../../../../../constants/Urlconfig";
import services from "../../../../../../utils/services";

import routeConfig from "../../../../../../constants/routeConfig";
import { addLoading, removeLoading } from "../../../../../../utils/buttonUtils";
import tracker from "../../../../../../analytics/tracker";
import get from "../../../../../../utils/jsUtils/get";

let _props;

const validateObj = {
  name: fieldRequiredError,
  email: fieldRequiredError,
  mobileNumber: fieldRequiredError,
  experienceYear: experienceFieldError,
  experienceMonth: experienceFieldError,
  ctc: fieldRequiredError
  // location: fieldRequiredError,
  // company: fieldRequiredError
};

// const renderSingleSuggester = props => <SingleSuggester {...props} />;

function handleApplySubmit(e) {
  e.preventDefault();

  const { contestApplyForm } = _props;
  const { values } = contestApplyForm;

  if (validateForm(values)) {
    const submitBtn = addLoading("contest_Apply");

    const formattedProfileObj = getProfileObjFromInstaApply(values);

    tracker().on("ctapEvent", {
      hitName: "signup_contest",
      payload: {
        page_name: "js_signup_contest",
        ct: true,
        ...formattedProfileObj
      }
    });

    services.post(UrlConfig.signup, formattedProfileObj).then(res => {
      if (res.status === 409) {
        // handle already registered case
        services
          .post(UrlConfig.login, {
            mobileNumber: values.mobileNumber
          })
          .then(res => {
            if (res.status >= 400) {
              handleCantResendOTP(
                res.status === 425
                  ? res.message
                  : "Oops ! Looks like are registered with different mobile number . Please try with alternate number.",
                submitBtn
              );
            } else {
              _props.setInteractionId(res.data.interactionId);
              localStorage.setItem("otpTimerDuration", 30);
              _props.history.push(
                `${routeConfig.otpPage}${_props.location.search}`,
                {
                  route: "contestApply",
                  interactionId: res.data.interactionId,
                  isEdit: true,
                  resendUrl: UrlConfig.login,
                  data: formattedProfileObj,
                  validateUrl: UrlConfig.validateLoginOtp,
                  isAlreadyRegistered: true,
                  ..._props.location.state,
                  isEditMobileNumber: false
                }
              );
            }
          });
      } else if (res.status === 200) {
        // handle new user
        _props.setInteractionId(res.data.interactionId);
        localStorage.setItem("otpTimerDuration", 30);
        _props.history.push(`${routeConfig.otpPage}${_props.location.search}`, {
          route: "contestApply",
          resendUrl: UrlConfig.signup,
          data: formattedProfileObj,
          validateUrl: UrlConfig.validateSignupOtp,
          ..._props.location.state,
          isEditMobileNumber: false
        });
      } else if (res.status === 425) {
        handleCantResendOTP(res.message, submitBtn);
      }
    });
  } else {
    return false;
  }
}

let ContestApplyForm = props => {
  _props = props;
  const {
    contestApplyForm = {},
    userBasicDetails,
    userDetails,
    initialValues
  } = props;

  const { isValid } = contestApplyForm;
  let cvResponse = JSON.parse(sessionStorage.getItem("instaCVUploadResp"));
  if (
    !cvResponse &&
    userDetails &&
    userDetails.profile &&
    userDetails.profile.cvPath &&
    userDetails.profile.fileKey &&
    userDetails.profile.fileName &&
    userDetails.profile.formKey
  ) {
    cvResponse = {
      cvPath: userDetails.profile.cvPath,
      fileKey: userDetails.profile.fileKey,
      fileName: userDetails.profile.fileName,
      formKey: userDetails.profile.formKey
    };
    sessionStorage.setItem("instaCVUploadResp", JSON.stringify(cvResponse));
  }
  const isUserLoggedIn = userBasicDetails && !!userBasicDetails.email;

  return (
    <form
      className="ContestApplyForm"
      onSubmit={handleApplySubmit}
      autoComplete="off"
      noValidate
    >
      <ReduxField
        name="name"
        form="contestApply"
        className={isUserLoggedIn ? "color_disabled" : ""}
        component={FormField}
        validate={validateObj.name}
        normalize={normalizeNameField(50)}
        label="Full Name"
        labelClassName="blue_grey_InputLabel"
        disabled={isUserLoggedIn}
        initialValue={initialValues.name}
        validateObj={validateObj}
      />
      <ReduxField
        name="email"
        form="contestApply"
        className={isUserLoggedIn ? "color_disabled" : ""}
        component={FormField}
        validate={validateObj.email}
        label="Email Address"
        labelClassName="blue_grey_InputLabel"
        disabled={isUserLoggedIn}
        initialValue={initialValues.email}
        validateObj={validateObj}
      />
      <ReduxField
        name="mobileNumber"
        form="contestApply"
        className={isUserLoggedIn ? "color_disabled" : ""}
        type="tel"
        component={FormField}
        validate={validateObj.mobileNumber}
        normalize={onlyNumbers(10)}
        placeholder="Enter 10 digit Mobile Number"
        label="Mobile Number"
        labelClassName="blue_grey_InputLabel"
        disabled={isUserLoggedIn}
        initialValue={initialValues.mobileNumber}
        validateObj={validateObj}
      />
      <h2 className="expLabel">Total work experience</h2>
      <div className="marginBottom_15">
        <ReduxField
          hasWrapper={false}
          name="experienceYear"
          form="contestApply"
          component={FormField}
          label="year(s)"
          labelClassName="static-InputLabel blue_grey_InputLabel"
          validate={validateObj.experienceYear}
          type="tel"
          normalize={normalizeYears("2")}
          className="experienceYear"
          placeholder="0"
          inputWrapperClass="isExperienceInput"
          validateObj={validateObj}
          initialValue={initialValues.experienceYear}
        />
        <ReduxField
          hasWrapper={false}
          name="experienceMonth"
          form="contestApply"
          component={FormField}
          label="month(s)"
          labelClassName="static-InputLabel blue_grey_InputLabel"
          validate={validateObj.experienceMonth}
          type="tel"
          normalize={normalizeMonths("2")}
          className="experienceMonth"
          placeholder="0"
          inputWrapperClass="isExperienceInput"
          validateObj={validateObj}
          initialValue={initialValues.experienceMonth}
        />
      </div>
      {/* <div className="marginBottom_20">
        <ReduxField
          name="company"
          form="contestApply"
          placeholder="Company Name"
          customClass="marginBottom_20"
          validate={validateObj.company}
          component={renderSingleSuggester}
          dataUrl={UrlConfig.getCompanies_suggestor}
          normalize={normalizeSingleSuggester(
            regexConfig.suggesterWithApos,
            "50"
          )}
          isScroll={true}
          initialValue={initialValues.company}
          validateObj={validateObj}
          fieldLabel="Company"
        />
      </div> */}
      <ReduxField
        name="ctc"
        form="contestApply"
        type="tel"
        component={FormField}
        validate={validateObj.ctc}
        normalize={decimalNumbers(10)}
        label="Annual CTC (in lacs)"
        labelClassName="blue_grey_InputLabel"
        initialValue={initialValues.ctc}
        validateObj={validateObj}
      />
      {/* <div className="marginBottom_20">
        <ReduxField
          name="location"
          form="contestApply"
          placeholder="Current Location"
          customClass="marginBottom_20"
          validate={validateObj.location}
          component={renderSingleSuggester}
          dataUrl={UrlConfig.getLocation_suggestor}
          normalize={normalizeSingleSuggester(regexConfig.suggester, "50")}
          isScroll={true}
          initialValue={initialValues.location}
          validateObj={validateObj}
          fieldLabel="Location"
        />
      </div> */}

      <div className="fixedToBottom">
        <Button
          disabled={!isValid}
          className="applyNowCTA"
          buttonType="submit"
          id="contest_Apply"
        >
          <span id="insta_Apply_success">Get Started</span>
        </Button>
      </div>
    </form>
  );
};

const handleCantResendOTP = (message, submitBtn) => {
  _props.openGlobalPrompt(message, "error");
  removeLoading(submitBtn);
};

const getProfileObjFromInstaApply = values => ({
  email: values.email,
  mobileNumber: values.mobileNumber,
  name: values.name,
  profileV2: {
    latestCompanyDetails: {
      ctc: values.ctc
      // location: values.location,
      // company: values.company
    },
    experienceMonth: values.experienceMonth ? values.experienceMonth : "0",
    experienceYear: values.experienceYear ? values.experienceYear : "0"
  }
});

const validateForm = values => {
  const error = {};
  if (emailValidationField(values.email)) {
    error.email = globalConfig.FORM_ERRORS.email;
  }
  if (mobileValidationError(values.mobileNumber)) {
    error.mobileNumber = globalConfig.FORM_ERRORS.mobileNumber;
  }
  if (Object.keys(error).length) {
    handleCustomFormError("contestApply", error, null, true);
  } else {
    return true;
  }
};

ContestApplyForm = connect((state, ownProps) => {
  return {
    initialValues: {
      name: get(ownProps, "userBasicDetails.name"),
      email: get(ownProps, "userBasicDetails.email"),
      mobileNumber: get(ownProps, "userBasicDetails.phoneNumber"),
      experienceMonth: get(
        state,
        "commonData.userDetails.profile.experienceMonth"
      ),
      experienceYear: get(
        state,
        "commonData.userDetails.profile.experienceYear"
      )
    }
  };
})(ContestApplyForm);

export default ContestApplyForm;
