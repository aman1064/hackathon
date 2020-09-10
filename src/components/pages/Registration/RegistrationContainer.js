import React, { Component } from "react";
import { connect } from "react-redux";
import RegistrationView from "./components/RegistrationView";
import OtherDomainScreen from "./components/OtherDomainScreen";
import {
  userRegistration,
  updateUserProfile,
  userLogout,
  setMobileNumberExists,
  handlepublicJDApply,
  openGlobalPrompt,
  forceRecommend,
  forceRecommendGetJobDetails,
  setJobId,
  getUserBasicDetails,
  postUpdateUserProfile,
  getPrefetchSuggestors
} from "../../../sagas/ActionCreator";
import {
  getRegistrationScreenData,
  getNextScreen,
  getPrevScreen,
  postUpdateUserDetails
} from "./saga/ActionCreator";
import {
  updateCurrentScreenWithPromise,
  getBasicUserDetails
} from "../Profile/saga/ActionCreator";
import { getJobDetails } from "../Jobs/saga/ActionCreator";
import { setInteractionId } from "../OtpPage/saga/ActionCreator";
import getProcessData from "../../../utils/getProcessData";
import routeConfig from "../../../constants/routeConfig";
import get from "../../../utils/jsUtils/get";
import {
  handleChangeData,
  handleFormValidState,
  reset
} from "../../organisms/Field/saga/ActionCreator";

class RegistrationContainer extends Component {
  componentDidMount() {
    const isEdit =
      this.props.location.state && this.props.location.state.isEdit;
    if (!isEdit) {
      this._isMounted = true;
      window.onpopstate = () => {
        if (this._isMounted) {
          if (window.location.pathname.includes("profile")) {
            this.props.history.push(routeConfig.profile);
          } else if (
            window.location.pathname.split("/").indexOf("registration") ===
              -1 &&
            !this.props.location.pathname.includes("addPhoneNumber") &&
            !window.location.pathname.includes("otp")
          ) {
            this.props.userLogout();
          }
        }
      };
    }
  }

  render() {
    const { pathname } = this.props.location;
    switch (pathname) {
      case routeConfig.noDomain:
        return <OtherDomainScreen {...this.props} />;
      default:
        return <RegistrationView {...this.props} />;
    }
  }
}

RegistrationContainer.propTypes = {};

const mapStateToProps = state => {
  const { registrationData, commonData, forms, userProfileData } = state;
  return {
    currentScreenConfig:
      registrationData.currentScreen &&
      Object.keys(registrationData.currentScreen).length > 0 &&
      getProcessData(registrationData.currentScreen, commonData.suggestors),
    experimentId: registrationData.experimentId,
    variationId: registrationData.variationId,
    optionData: registrationData.optionData,
    screens: registrationData.screens,
    defaultFlow: registrationData.defaultFlow,
    count: registrationData.count,
    isUserProfileCompleted:
      commonData.userDetails.profile.isUserProfileCompleted,
    jobRoleData: registrationData.jobRoleData,
    firstScreenId: registrationData.firstScreenId,
    profile: commonData.userDetails.profile,
    mobileNumberExists: commonData.userDetails.mobileNumberExists,
    mobileNumberVerified: commonData.userDetails.mobileNumberVerified,
    basicUserDetails: userProfileData.basicUserDetails,
    reduxFormIds: Object.keys(forms),
    accessToken: commonData.userDetails.accessToken,
    suggestors: commonData.suggestors,
    phoneNumberValue : get(forms, "phoneNumber.values.mobileNumber"),
    forms,
    suggestorLastUpdatedTime: get(commonData, "suggestors.updatedTime")
  };
};

export default connect(
  mapStateToProps,
  {
    getRegistrationScreenData,
    userRegistration,
    getNextScreen,
    getPrevScreen,
    updateUserProfile,
    userLogout,
    updateCurrentScreenWithPromise,
    getBasicUserDetails,
    postUpdateUserDetails,
    setMobileNumberExists,
    handlepublicJDApply,
    openGlobalPrompt,
    forceRecommend,
    forceRecommendGetJobDetails,
    getJobDetails,
    setJobId,
    getUserBasicDetails,
    handleChangeData,
    setInteractionId,
    postUpdateUserProfile,
    handleFormValidState,
    reset,
    getPrefetchSuggestors
  }
)(RegistrationContainer);
