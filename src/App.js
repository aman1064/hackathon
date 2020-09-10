/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Switch, withRouter, Redirect, Route } from "react-router-dom";
import Loadable from "react-loadable";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Loading from "./components/atoms/Loading";
import routeConfig from "./constants/routeConfig";
import GlobalTemplates from "./components/templates/GlobalTemplates";
import appConstants from "./constants/appConstants";
import ErrorPage from "./components/pages/ErrorPage";
import * as CommonSaga from "./sagas/ActionCreator";
import { getJobDetails } from "./components/pages/Jobs/saga/ActionCreator";
import { getUserProfile } from "./components/pages/Profile/saga/ActionCreator";
import parseJwt from "./utils/isAgent";
import { getRegistrationScreenData } from "./components/pages/Registration/saga/ActionCreator";
import userTimingsTracker from "./analytics/userTimings";
import tracker from "./tracker";

import ErrorBoundary from "./components/pages/ErrorBoundary/ErrorBoundary";
import WhatsappOptInModal from "./components/templates/WhatsappOptInModal";
import showOptIn from "./utils/showOptIn";
import { getCookie } from "./utils/Cookie";
import isMobileDevice from "./utils/isMobileDevice";

window.__bgperformance = userTimingsTracker();

const Login = Loadable({
  loader: () =>
    import(/* webpackChunkName: "login-view" */ "./components/pages/Login"),
  loading: Loading
});

const OtpPage = Loadable({
  loader: () =>
    import(/* webpackChunkName: "otp-view" */ "./components/pages/OtpPage"),
  loading: Loading
});

const PublicJD = Loadable({
  loader: () =>
    import(/* webpackChunkName: "public-jd" */ "./components/pages/PublicJD"),
  loading: Loading
});

const Practice = Loadable({
  loader: () =>
    import(/* webpackChunkName: "practice" */ "./components/pages/Practice"),
  loading: isMobileDevice() ? Loading : () => <div />
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  setLandingRoute(path) {
    const pathArray = path.split("/");
    if (Object.values(routeConfig).includes(`/${pathArray[1]}`)) {
      this.landingRoute = path;
      this.landingRoute += window.location.search;
    }
  }

  render() {
    const {
      location,
      whatsappOptin,
      showWhatsappOptInModal,
      whatsappSubscription,
      showWhatsappOptIn,
      isJobApplied,
      trackerCat,
      accessToken
    } = this.props;
    let { mobileNumberVerified } = this.props;
    const {
      login,
      signup,
      root,
      errorPage,
      publicJD,
      otpPage,
      practice
    } = routeConfig;
    if (
      !accessToken &&
      !appConstants.NO_ACCESS_TOKEN_ROUTES.includes(location.pathname)
    ) {
      this.setLandingRoute(location.pathname);
    }
    const isAgentProcess = accessToken && parseJwt(accessToken);
    if (isAgentProcess) {
      mobileNumberVerified = true;
    }
    const showWAModal =
      !isAgentProcess &&
      !whatsappSubscription &&
      showWhatsappOptInModal &&
      showOptIn(
        getCookie("lastRejectTime") || 0,
        getCookie("rejectCount") || 0
      );
    return (
      <ErrorBoundary>
        <React.Fragment>
          <GlobalTemplates />
          {accessToken && (
            <WhatsappOptInModal
              open={showWAModal}
              whatsappOptin={whatsappOptin}
              showWhatsappOptIn={showWhatsappOptIn}
              isJobApplied={isJobApplied}
              trackerCat={trackerCat}
            />
          )}

          {navigator.onLine ? (
            <Switch>
              <Route path={practice} component={Practice} />
              <Route exact path={errorPage} component={ErrorPage} />
              <Route exact path={publicJD} component={PublicJD} />
              <Route exact path={otpPage} component={OtpPage} />
              {((accessToken && !mobileNumberVerified) || !accessToken) && (
                <Route exact path={[login, signup]} component={Login} />
              )}

              {!accessToken && (
                <Redirect
                  to={{
                    pathname: login,
                    state: { landingRoute: this.landingRoute },
                    search: this.props.location.search
                  }}
                />
              )}
            </Switch>
          ) : (
            <Route
              path={root}
              render={props => <ErrorPage {...props} isOffline />}
            />
          )}
        </React.Fragment>
      </ErrorBoundary>
    );
  }
}

App.propTypes = {
  location: PropTypes.object
};

const mapStateToProps = ({ commonData, registrationData }) => {
  return {
    isUserProfileCompleted:
      commonData.userDetails.profile.isUserProfileCompleted,
    mobileNumberVerified: commonData.userDetails.mobileNumberVerified,
    accessToken: commonData.userDetails.accessToken,
    firstScreenId: registrationData.firstScreenId,
    statusNavRoute: commonData.statusNavRoute,
    profile: commonData.userDetails.profile,
    showWhatsappOptInModal: commonData.showWhatsappOptInModal,
    isJobApplied: commonData.isJobApplied,
    trackerCat: commonData.trackerCat,
    whatsappSubscription:
      commonData.userBasicDetails &&
      commonData.userBasicDetails.whatsappSubscription
  };
};

export default connect(
  mapStateToProps,
  {
    ...CommonSaga,
    getUserProfile,
    getRegistrationScreenData,
    getJobDetails
  },
  null,
  {
    pure: false
  }
)(withRouter(App));
