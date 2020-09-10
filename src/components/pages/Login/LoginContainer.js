import React from "react";
import { connect } from "react-redux";
import LoginView from "./component/LoginView";
import SignupView from "./component/SignupView";
import RouteConfig from "../../../constants/routeConfig";
import {
  userLogin,
  userRegistration,
  openGlobalPrompt,
  forceRecommend,
  forceRecommendGetJobDetails,
  getUserBasicDetails,
  setJobId,
  socialLogin
} from "../../../sagas/ActionCreator";
import { getUserProfile } from "../Profile/saga/ActionCreator";
import { getRegistrationScreenData } from "../Registration/saga/ActionCreator";
import { getJobDetails } from "../Jobs/saga/ActionCreator";
import { setInteractionId } from "../OtpPage/saga/ActionCreator";
import get from "../../../utils/jsUtils/get";
import {
  handleFormValidState,
  handleFieldError
} from "../../organisms/Field/saga/ActionCreator";

import "./Login.scss";

const LoginContainer = props => {
  const { pathname } = props.location;
  const { login, incompleteProfile } = RouteConfig;
  switch (pathname) {
    case incompleteProfile:
    case login:
      return <LoginView {...props} />;
    default:
      return <SignupView {...props} />;
  }
};

LoginContainer.propTypes = {};

const mapStateToProps = ({ commonData, forms }) => {
  return {
    isUserProfileCompleted:
      commonData.userDetails.profile.isUserProfileCompleted,
    accessToken: commonData.userDetails.accessToken,
    loginForm: get(forms, "login"),
    signupForm: get(forms, "signup")
  };
};

export default connect(mapStateToProps, {
  userLogin,
  userRegistration,
  getUserProfile,
  getRegistrationScreenData,
  openGlobalPrompt,
  forceRecommend,
  getJobDetails,
  forceRecommendGetJobDetails,
  getUserBasicDetails,
  setJobId,
  socialLogin,
  setInteractionId,
  handleFormValidState,
  handleFieldError
})(LoginContainer);
