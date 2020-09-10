import React, { Component } from "react";
import { connect } from "react-redux";

import OtpView from "./components/OtpView";
import {
  validateOTP,
  openGlobalPrompt,
  handlepublicJDApply,
  userVerify,
  userVerifyForceRecommend,
  forceRecommendAndApply,
  forceRecommend,
  forceRecommendGetJobDetails
} from "../../../sagas/ActionCreator";
import { resendOTP, setInteractionId } from "./saga/ActionCreator";
import { postCompletedProfile } from "../Registration/saga/ActionCreator";
import { getJobDetails } from "../Jobs/saga/ActionCreator";

class OtpContainer extends Component {
  render() {
    const { pathname } = this.props.location;
    switch (pathname) {
      default:
        return <OtpView {...this.props} />;
    }
  }
}

const mapStateToProps = ({ commonData, otpData, jobData }) => {
  return {
    jobDetails: jobData.jobDetails,
    accessToken: commonData.userDetails.accessToken,
    interactionId: otpData.interactionId
  };
};

export default connect(mapStateToProps, {
  validateOTP,
  resendOTP,
  openGlobalPrompt,
  setInteractionId,
  handlepublicJDApply,
  forceRecommendAndApply,
  postCompletedProfile,
  forceRecommend,
  forceRecommendGetJobDetails,
  getJobDetails,
  userVerify,
  userVerifyForceRecommend
})(OtpContainer);
