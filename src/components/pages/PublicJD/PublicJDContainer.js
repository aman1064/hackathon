import React, { Component } from "react";
import { connect } from "react-redux";
import routeConfig from "../../../constants/routeConfig";
import PublicJDView from "./components/PublicJDView";
import {
  getJobDetails,
  postApplyJob,
  removeJob,
  setBookmark,
  deleteBookmark
} from "../Jobs/saga/ActionCreator";
import { updateCurrentScreenWithPromise } from "../Profile/saga/ActionCreator";
import {
  openGlobalPrompt,
  handlepublicJDApply,
  forceRecommend,
  showWhatsappOptIn
} from "../../../sagas/ActionCreator";

import "./PublicJD.scss";

class PublicJDContainer extends Component {
  render() {
    const { pathname } = this.props.location;
    const { publicJD } = routeConfig;
    switch (pathname) {
      case publicJD:
      default:
        return <PublicJDView {...this.props} />;
    }
  }
}

const mapStateToProps = ({ commonData, jobData }) => ({
  jobDetails: jobData.jobDetails,
  aboutCompany: jobData.aboutCompany,
  isUserProfileCompleted: commonData.userDetails.profile.isUserProfileCompleted,
  accessToken: commonData.userDetails.accessToken,
  cvInProfile: commonData.userDetails.profile.fileName,
  profile: commonData.userDetails.profile,
  whatsappSubscription:
    commonData.userBasicDetails &&
    commonData.userBasicDetails.whatsappSubscription
});

export default connect(
  mapStateToProps,
  {
    getJobDetails,
    updateCurrentScreenWithPromise,
    postApplyJob,
    openGlobalPrompt,
    removeJob,
    setBookmark,
    deleteBookmark,
    handlepublicJDApply,
    forceRecommend,
    showWhatsappOptIn
  }
)(PublicJDContainer);
