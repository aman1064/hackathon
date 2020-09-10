import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loadable from "react-loadable";
import Loading from "../../atoms/Loading";
import {
  getJobDetails,
  getRecommendedJobs,
  getRecommendedJobsPostView,
  getViewedJobs,
  getSavedJobs,
  setBookmark,
  deleteBookmark,
  removeJob,
  postViewedJob,
  postApplyJob,
  setActiveSwipeJobIndex,
  getCVUploadScreenConfig
} from "./saga/ActionCreator";
import {
  openGlobalPrompt,
  setJobId,
  userLogout,
  postUpdateUserProfile,
  handlepublicJDApply,
  showWhatsappOptIn,
  getUserBasicDetails,
  isUserRegistered
} from "../../../sagas/ActionCreator";
import { postCompletedProfile } from "../Registration/saga/ActionCreator";
import routeConfig from "../../../constants/routeConfig";
import removeTrailingSlash from "../../../utils/removeTrailingSlash";
// TODO move this to commonSaga
import {
  // updateCurrentScreen,
  updateCurrentScreenWithPromise
} from "../Profile/saga/ActionCreator";

const JobsView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "new-jobs-view" */ "./components/JobsView"),
  loading: Loading
});

const ViewedJobs = Loadable({
  loader: () =>
    import(/* webpackChunkName: "processed-jobs-view" */ "./components/ViewedJobs/ViewedJobs"),
  loading: Loading
});

const KnowMoreView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "DetailedJd-view" */ "./components/KnowMoreView"),
  loading: Loading
});

const Registration = Loadable({
  loader: () =>
    import(/* webpackChunkName: "registration-view" */ "../Registration"),
  loading: Loading
});
const ApplicationSent = Loadable({
  loader: () =>
    import(/* webpackChunkName: "Application-sent-view" */ "../QuickApply/component/ApplicationSent"),
  loading: Loading
});

const CommonJD = Loadable({
  loader: () =>
    import(/* webpackChunkName: "CommonJD-view" */ "./components/CommonJD"),
  loading: Loading
});

class JobsContainer extends Component {
  render() {
    const { pathname, search } = this.props.location;
    const {
      viewedJobs,
      savedJobs,
      applyWithCV,
      quickApplySplashScreen,
      jobs,
      consentJd
    } = routeConfig;
    const path = removeTrailingSlash(pathname);
    switch (path) {
      case viewedJobs:
      case savedJobs:
        return <ViewedJobs {...this.props} />;
      case applyWithCV:
        return <Registration {...this.props} />;
      case quickApplySplashScreen:
        return <ApplicationSent {...this.props} />;
      case jobs:
        if (search.includes("jobId=")) {
          return <KnowMoreView {...this.props} />;
        }
        return <JobsView {...this.props} />;
      case consentJd:
        return <CommonJD {...this.props} />;
      default:
        return <KnowMoreView {...this.props} />;
    }
  }
}

JobsContainer.propTypes = {
  jobDetails: PropTypes.object,
  basicInfo: PropTypes.object,
  recommendedJobs: PropTypes.object,
  location: PropTypes.object
};

JobsContainer.defaultProps = {
  jobDetails: {},
  basicInfo: {},
  recommendedJobs: {},
  location: {}
};

const mapStateToProps = ({ jobData, commonData }) => ({
  jobDetails: jobData.jobDetails,
  basicInfo: jobData.basicInfo,
  recommendedJobs: jobData.recommendedJobs,
  jobs: jobData.jobs,
  viewedJobs: jobData.viewedJobs,
  savedJobs: jobData.savedJobs,
  aboutCompany: jobData.aboutCompany,
  activeSwipeJobIndex: jobData.activeSwipeJobIndex,
  cvInProfile: commonData.userDetails.profile.fileName,
  profile: commonData.userDetails.profile,
  agentId: localStorage.getItem("agentId"),
  whatsappSubscription:
    commonData.userBasicDetails &&
    commonData.userBasicDetails.whatsappSubscription,
  isUserProfileCompleted: commonData.userDetails.profile.isUserProfileCompleted,
  accessToken: commonData.userDetails.accessToken,
  jobsNavClicked: commonData.jobsNavClicked || false
});

export default connect(
  mapStateToProps,
  {
    getRecommendedJobs,
    getRecommendedJobsPostView,
    getJobDetails,
    setJobId,
    getViewedJobs,
    getSavedJobs,
    setBookmark,
    deleteBookmark,
    removeJob,
    postViewedJob,
    postApplyJob,
    openGlobalPrompt,
    setActiveSwipeJobIndex,
    userLogout,
    getCVUploadScreenConfig,
    updateCurrentScreenWithPromise,
    postUpdateUserProfile,
    postCompletedProfile,
    handlepublicJDApply,
    showWhatsappOptIn,
    getUserBasicDetails,
    isUserRegistered
  }
)(JobsContainer);
