import React, { Component } from "react";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import {
  getBasicUserDetails,
  updateCurrentScreenWithPromise,
  getProfileEditScreens,
  getUserProfile,
  getJobRoleData
} from "./saga/ActionCreator";
import { userLogout } from "../../../sagas/ActionCreator";
import routeConfig from "../../../constants/routeConfig";
import appConstants from "../../../constants/appConstants";
import Loading from "../../atoms/Loading";

const Registration = Loadable({
  loader: () =>
    import(/* webpackChunkName: "registration-view" */ "../Registration"),
  loading: Loading
});
const Setting = Loadable({
  loader: () =>
    import(/* webpackChunkName: "setting-view" */ "./components/Setting"),
  loading: Loading
});
const ProfileView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "profile-view" */ "./components/ProfileView"),
  loading: Loading
});
class ProfileContainer extends Component {
  componentDidMount() {
    window.onpopstate = () => {
      if (window.location.pathname.includes("otp")) {
        this.props.history.push(routeConfig.profile);
      }
    };
  }

  render() {
    const { pathname, state } = this.props.location;
    const { profileSetting, profile } = routeConfig;
    switch (pathname) {
      case profile:
        return (
          <ProfileView
            {...this.props}
            editPreferences={state && state.editPreferences ? true : undefined}
          />
        );
      case profileSetting:
        return <Setting {...this.props} />;
      default:
        const path = window.location.pathname.split("/");
        if (!appConstants.APLHANUMERIC_REGEX.test(path[2])) {
          if (
            path[2] != "edit_job_search_status" &&
            path[2] != "edit_highest_education"
          ) {
            return (
              <ProfileView
                {...this.props}
                editPreferences={
                  state && state.editPreferences ? true : undefined
                }
              />
            );
          } else {
            return <Registration {...this.props} />;
          }
        }

        return <Registration {...this.props} />;
    }
  }
}

ProfileContainer.propTypes = {};

const mapStateToProps = ({ userProfileData, commonData }) => {
  return {
    basicUserDetails: userProfileData.basicUserDetails,
    profileEditScreens: userProfileData.profileEditScreens,
    userProfile: commonData.userDetails.profile,
    positionData: userProfileData.positionData,
    jobRoleData: userProfileData.jobRoleData
  };
};

export default connect(mapStateToProps, {
  getBasicUserDetails,
  //updateCurrentScreen,
  updateCurrentScreenWithPromise,
  getProfileEditScreens,
  getUserProfile,
  //getPositionData,
  getJobRoleData,
  userLogout
})(ProfileContainer);
