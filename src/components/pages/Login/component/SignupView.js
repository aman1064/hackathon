import React, { Component } from "react";

import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import SocialLogin from "../../../organisms/SocialLogin";
import {
  validateForm,
  onlyNumbers,
  normalizeNameField,
  fieldRequiredErrorWithHighlight
} from "../../../templates/Form/Validate";
import { trackCleverTap, trackCT } from "../../../../utils/tracking";
import Urlconfig from "../../../../constants/Urlconfig";
import LogoHeader from "../../../organisms/LogoHeader/LogoHeader";
import { addLoading, removeLoading } from "../../../../utils/buttonUtils";
import tracker from "../../../../analytics/tracker";
import SignupForm from "./SignupForm";
import FormField from "../../../molecules/FormField";

const config = {
  common: {
    form: "signup",
    component: FormField,
    validate: fieldRequiredErrorWithHighlight
  },
  formFields: [
    {
      regexstr: "^[a-zA-Z ,.'-]+$",
      name: "signup$name$formNameInput",
      id: "5c77a81d08db4e3507a253f6",
      type: "text",
      label: "Full Name",
      isoptional: "false",
      normalize: normalizeNameField("50"),
      validate: fieldRequiredErrorWithHighlight
    },
    {
      regexstr:
        "^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+-+)|([A-Za-z0-9]+\\.+)|([A-Za-z0-9]+\\++))*[A-Za-z0-9]+@((\\w+-+)|(\\w+\\.))*\\w{1,63}\\.[a-zA-Z]{2,10}$",
      name: "signup$email$formEmailInput",
      id: "5c77a81d08db4e3507a253f7",
      type: "email",
      label: "E-mail Id",
      isoptional: "false",
      validate: fieldRequiredErrorWithHighlight
    },
    {
      regexstr: "^[+]?[0-9]{10,15}$",
      name: "signup$mobileNumber$formMobileInput",
      id: "5c77a81d08db4e3507a253f8",
      type: "tel",
      placeholder: "Enter 10 digit Mobile Number",
      label: "Mobile Number",
      isoptional: "false",
      normalize: onlyNumbers("10"),
      validate: fieldRequiredErrorWithHighlight
    }
  ]
};

class SignupView extends Component {
  _isMounted = false;
  handleSubmit = e => {
    e.preventDefault();
    const { signupForm = {}, handleFormValidState } = this.props;
    const { values } = signupForm;
    const submitBtn = addLoading("signup_btn");
    tracker().on("event", {
      hitName: `registration$signup_clicked$signup_screen`
    });

    tracker().on("ctapEvent", {
      hitName: "signup_page_signup_click",
      payload: {
        page_name: "js_signup"
      }
    });
    if (validateForm(config.formFields, values, "signup")) {
      const postObj = {};
      for (const key in values) {
        if (values.hasOwnProperty(key)) {
          const keyArray = key.split("$");
          postObj[keyArray[1]] = values[key].trim();
        }
      }
      const promise = new Promise((resolve, reject) => {
        this.props.userRegistration(resolve, reject, postObj);
      });
      promise.then(res => {
        tracker().on("event", {
          hitName: `registration$signup_success$signup_screen`
        });
        this.props.setInteractionId(res.data.interactionId);
        localStorage.setItem("otpTimerDuration", 30);
        removeLoading(submitBtn);
        this.props.history.push(routeConfig.otpPage, {
          route: "signup",
          isEditMobileNumber: true,
          resendUrl: Urlconfig.signup,
          data: postObj,
          validateUrl: Urlconfig.validateSignupOtp
        });
        tracker().on("event", {
          hitName: `registration$get_started_success$signup_screen`
        });
        trackCleverTap("SignUPClicked_SignUpScreen", {
          SignupAttemptedStatus: "success"
        });
        trackCT("SignUPClicked_SignUpScreen", {
          SignupAttemptedStatus: "success"
        });
      });
      return promise.catch(err => {
        removeLoading(submitBtn);
        tracker().on("event", {
          hitName: `registration$signup_fail$signup_screen`
        });
        trackCleverTap("SignUPClicked_SignUpScreen", {
          SignupAttemptedStatus: "Failed",
          Reason_SignupFail: err.message
        });
        handleFormValidState({
          form: "signup",
          isValid: false,
          errorMsg: err.message
        });
      });
    }
  };

  componentWillMount() {
    const { handleFormValidState } = this.props;
    handleFormValidState({ form: "signup", isValid: true, errorMsg: "" });
  }

  componentDidMount() {
    if (this.props.accessToken) {
      /* in case of social signup we have accesstoken before OTP ,
       in this case if user enters /login in browser then we should 
       delete everything for that user */
      localStorage.clear();
    }
    window.__bgperformance.pageMeasure();
    this._isMounted = true;
  }
  componentDidUpdate() {
    if (this._isMounted) {
      tracker().on("ctapPageView", {
        hitName: "pv_signup",
        payload: {
          page_name: "js_signup"
        }
      });
    }
    this._isMounted = false;
  }
  handleLoginOnClick = () => {
    tracker().on("event", {
      hitName: `registration$login_clicked$signup_screen`
    });
    trackCleverTap("LoginClicked_SignUpScreen");
    this.props.history.push(
      `${routeConfig.login}${this.props.history.location.search}`
    );
  };

  render() {
    const { signupForm = {} } = this.props;
    const { isValid, errorMsg } = signupForm;
    return (
      <div className="LoginView">
        <LogoHeader
          isSmallLogo
          hitName="registration$bigshyft_logo_clicked$signup_screen"
        >
          <Button type="link" onClick={this.handleLoginOnClick}>
            Login
          </Button>
        </LogoHeader>
        <h1 className="Login__Header extra_bold">
          {" "}
          Handpicked jobs brought to you!
        </h1>
        <p className="LoginView__loginSignupRedirect">
          {`Join 1000s like you who've found their dream jobs with top companies like Amazon, Ola, Oyo, Hotstar and many more`}
        </p>
        <SocialLogin {...this.props} pageName="signup" />
        <p className="marginTop_20 marginBottom_15 smButtonSeparator">or</p>
        <SignupForm
          config={config}
          onSubmit={this.handleSubmit}
          isValid={isValid}
          errorMessage={errorMsg}
        />
      </div>
    );
  }
}

export default SignupView;
