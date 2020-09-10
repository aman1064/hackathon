// FormContainer
import React, { Component } from "react";
import Form from "./Form";
import store from "../../../store/Store";

class FormContainer extends Component {
  state = {
    showPassword: false
  };
  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  getDependentFieldValue = () => {
    const path = window.location.pathname.split("/");
    const currentScreenConfig = this.props.config;
    const formState = store.getState();
    if (
      currentScreenConfig.name &&
      path[2] &&
      path[2] === currentScreenConfig.name
    ) {
      // const selector = formValueSelector(currentScreenConfig.name);
      const dependentFieldValue = [];
      currentScreenConfig.formFields &&
        currentScreenConfig.formFields.forEach(field => {
          // if (field.dependentFieldName) {
          //   dependentFieldValue.push(
          //     selector(formState, field.dependentFieldName)
          //   );
          // }
          // Set form name of specialization in localStorage
          if (field.name === "profile$specializationId$modalSelect") {
            localStorage.setItem(
              "profile$specializationId$modalSelect$formName",
              currentScreenConfig.name
            );
          }
        });
      if (
        dependentFieldValue.length > 0 &&
        localStorage.getItem("specializationsApiData") !== "undefined"
      ) {
        const specializationsApiData = JSON.parse(
          localStorage.getItem("specializationsApiData")
        );
        const selectedData =
          specializationsApiData &&
          specializationsApiData.find(
            data => data.id === dependentFieldValue[0]
          );
        return selectedData || "";
      } else {
        return "";
      }
    }
  };

  render() {
    const dependentFieldValue = this.getDependentFieldValue();
    const formState = store.getState(),
      latestCompanyDetailsPageId =
        formState.registrationData.currentScreen &&
        formState.registrationData.currentScreen.id,
      latestCompanyDetailsPage = formState.forms[latestCompanyDetailsPageId],
      ctcValue =
        latestCompanyDetailsPage &&
        latestCompanyDetailsPage.values &&
        latestCompanyDetailsPage.values.latestCompanyDetails$ctc$floatInput;
    const quickApplyPage = formState.forms["quickRegistration"];
    const QACtcValue =
      quickApplyPage && quickApplyPage.values && quickApplyPage.values.ctc;
    return (
      <Form
        {...this.props}
        onSubmit={this.props.onSubmit}
        handleClickShowPassword={this.handleClickShowPassword}
        showPassword={this.state.showPassword}
        ctcValue={ctcValue}
        dependentFieldValue={dependentFieldValue}
        QACtcValue={QACtcValue}
      />
    );
  }
}

export default FormContainer;
