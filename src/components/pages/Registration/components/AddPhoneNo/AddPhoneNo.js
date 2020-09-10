import React, { Component } from "react";
import { connect } from "react-redux";

import FormContainer from "../../../../templates/Form/FormContainer";
import LogoHeader from "../../../../organisms/LogoHeader";

import {
  fieldRequiredError,
  onlyNumbers,
  validateForm
} from "../../../../templates/Form/Validate";
import "./AddPhoneNo.scss";
import tracker from "../../../../../analytics/tracker";
import routeConfig from "../../../../../constants/routeConfig";

function mapStateToProps(state, props) {
  const data =
    props.location && props.location.state && props.location.state.data;
  return {
    form: "phoneNumber",
    initialValues: {
      mobileNumber: data && data.mobileNumber
    },
    enableReinitialize: true,
    isValid: state.forms.phoneNumber && state.forms.phoneNumber.isValid
  };
}

const ConnectedFC = connect(mapStateToProps)(FormContainer);

function addPhoneConfig(initialValues) {
  return {
  name: "phoneNumber",
  container: {
    className: "PhoneNumber__form"
  },
  button: {
    className: "",
    color: "primary",
    customClass: "textCenter fixedToBottom",
    id: "AddPhoneNoCta",
    name: "AddPhoneNoCta",
    isTextButton: false,
    submitButtonText: "Next",
    type: "submit",
    variant: "outlined"
  },

  formFields: [
    {
      id: "mobileNumber",
      form: "phoneNumber",
      name: "mobileNumber",
      type: "tel",
      label: "Mobile number",
      placeholder: "Enter 10 digit Mobile Number",
      className: "input_field",
      validate: fieldRequiredError,
      normalize: onlyNumbers("10"),
      initialValues:{initialValues}
    }
  ]
}
};

class PhoneNumberForm extends Component {
  state = {};

  sendGAEvents = action => {
    const { location } = this.props;
    const isEditMobileNumber =
      location.state && location.state.isEditMobileNumber;
    if (isEditMobileNumber) {
      tracker().on("event", {
        hitName: `registration$${action}$edit_number_screen`
      });
    } else {
      tracker().on("event", {
        hitName: `registration$${action}$social_login_mobile`
      });
    }
  };
  componentWillMount(){
    this.props.handleChangeData({
      form: "phoneNumber",
      fieldName: "mobileNumber",
      value: ""
    });
  }
  handleSubmit = (values, e) => {
    e.preventDefault();
    const { accessToken, forms } = this.props;
    this.sendGAEvents("next_button_clicked");
    const params = (forms.phoneNumber && forms.phoneNumber.values) || {};
    if (validateForm(addPhoneConfig().formFields, params, "phoneNumber")) {
      const promise = new Promise((resolve, reject) => {
        const postUpdateUserDetailsUrl = values.resendUrl;
        let postData;
        if (accessToken) {
          postData = params;
        } else {
          postData = values.data;
          postData.mobileNumber = params.mobileNumber;
        }
        this.props.postUpdateUserDetails(
          postUpdateUserDetailsUrl,
          postData,
          resolve,
          reject
        );
      });
      promise.then(res => {
        this.props.setInteractionId(res.data.interactionId);
        localStorage.setItem("otpTimerDuration", 30);
        this.sendGAEvents("next_success_clicked");
        if (this.props.accessToken) {
          this.props.history.push(routeConfig.otpPage, {
            route: "socialLogin",
            isEditMobileNumber: true,
            resendUrl: values.resendUrl,
            data: params,
            validateUrl: values.validateUrl
          });
        } else {
          values.data.mobileNumber = params.mobileNumber;
          this.props.history.push(routeConfig.otpPage, values);
        }
      });
      return promise.catch(err => {
        this.sendGAEvents("next_fail");
        this.props.openGlobalPrompt(err.message, "error");
      });
    }
  };

  handleBackClick = context => {
    this.sendGAEvents("back_button_clicked");
    if (context && context.logoutonBack) {
      this.props.userLogout();
      this.props.history.push(routeConfig.signup);
    } else {
      this.props.history.goBack();
    }
  };

  handleClearClick = () => {
    this.sendGAEvents("clear_button_clicked");
    this.props.handleChangeData({
      form: "phoneNumber",
      fieldName: "mobileNumber",
      value: ""
    });
  };

  render() {
    const { location, phoneNumberValue } = this.props;
    const isEditMobileNumber =
      location.state && location.state.isEditMobileNumber;
    const mobileNumber = location.state && location.state.data.mobileNumber;
    return (
      <div className="registrationPage">
        <div className="registrationPage__headerNav flexCenter marginBottom_36 spreadHr">
          <LogoHeader
            isSmallLogo
            className="padding_0"
            hitName={
              isEditMobileNumber ? (
                "registration$bigshyft_logo_clicked$edit_number_screen"
              ) : (
                "registration$bigshyft_logo_clicked$social_login_mobile"
              )
            }
          />
        </div>
        <h3 className="color_mid_night fontW_normal marginBottom_40">
          {location.state && location.state.heading ? (
            location.state.heading
          ) : (
            "Enter the mobile number on which you wish to receive the OTP"
          )}
        </h3>
        <div className="position_relative">
          <ConnectedFC
            config={addPhoneConfig(mobileNumber)}
            onSubmit={this.handleSubmit.bind(this, location.state)}
            handleBackClick={this.handleBackClick.bind(this, location.state)}
            formId={addPhoneConfig.name}
            form={addPhoneConfig.name}
            {...this.props}
          />
          {phoneNumberValue && (
            <span className="AddPhoneNo__clear" onClick={this.handleClearClick}>
              Clear
            </span>
          )}
        </div>
      </div>
    );
  }
}

export default PhoneNumberForm;
