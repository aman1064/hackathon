import React, { Component } from "react";
import { connect } from "react-redux";
import PreferencesForm from "./PreferencesForm";

import { getNextScreen } from "../../saga/ActionCreator";
import {
  updateUserProfile,
  openGlobalPrompt
} from "../../../../../sagas/ActionCreator";
import { getUserProfile } from "../../../Profile/saga/ActionCreator";
import get from "../../../../../utils/jsUtils/get";
import {
  handleChangeData,
  handleFormValidState,
  reset
} from "../../../../organisms/Field/saga/ActionCreator";

class PreferencesComp extends Component {
  componentWillUnmount() {
    const { history, reset, formValues, handleChangeData } = this.props;
    const isEdit = history.location.pathname.includes("profile");
    if (isEdit) {
      reset("preferences");
    }

    if (
      formValues &&
      formValues.locations &&
      !formValues.locations.length &&
      formValues.strictPreferredLocation
    ) {
      handleChangeData({
        form: "preferences",
        fieldName: "strictPreferredLocation",
        value: false
      });
    }
  }
  componentWillMount(){
    const { history, handleChangeData } = this.props;
    const isEdit = history.location.pathname.includes("profile");
    if(isEdit){
      ["expectedCTC","locations","strictPreferredLocation","companyTypes","roleTypes","benefits"].forEach((key)=> {
        handleChangeData({
          form:"preferences",
          fieldName:key,
          touched:false,
          value:""
        })
      })
    }
  }

  render() {
    return (
      <div>
        <PreferencesForm {...this.props} />
      </div>
    );
  }
}

const getInitialValuesFromProfile = profileObj => {
  let returnObj = {};
  if (!profileObj.preferences) {
    returnObj = {
      expectedCTC: "",
      strictPreferredLocation: false,
      location: [],
      benefits: [],
      companyTypes: [],
      roleTypes: []
    };
  } else {
    returnObj.expectedCTC =
      profileObj.preferences.expectedCTC > 0
        ? profileObj.preferences.expectedCTC
        : "";
    returnObj.strictPreferredLocation =
      profileObj.preferences.strictPreferredLocation || false;
    returnObj.locations = profileObj.preferences.locations;
    returnObj.benefits = profileObj.preferences.benefits;
    returnObj.companyTypes = profileObj.preferences.companyTypes;
    returnObj.roleTypes = profileObj.preferences.roleTypes;
  }
  return returnObj;
};

const mapSTP = (state, props) => {
 
  const experimentId = state.registrationData.experimentId,
    variationId = state.registrationData.variationId,
    profile = state.commonData.userDetails.profile,
    values = get(state.forms, "preferences.values"),
    isValid = get(state.forms, "preferences.isValid"),
    enableReinitialize =
      props.history &&
      props.history.location.state &&
      props.history.location.state.isEdit;
  return {
    formValues: values,
    profile,
    experimentId,
    variationId,
    initialValues: getInitialValuesFromProfile(profile),
    enableReinitialize,
    isValid
  };
};

export default connect(mapSTP, {
  getNextScreen,
  updateUserProfile,
  handleChangeData,
  handleFormValidState,
  reset,
  openGlobalPrompt,
  getUserProfile
})(PreferencesComp);

