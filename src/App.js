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
import { getRegistrationScreenData } from "./components/pages/Registration/saga/ActionCreator";
import userTimingsTracker from "./analytics/userTimings";
import ErrorBoundary from "./components/pages/ErrorBoundary/ErrorBoundary";
import isMobileDevice from "./utils/isMobileDevice";
import Company from "./components/pages/Company";
import CompanyJobDetail from "./components/pages/CompanyJobDetail";

window.__bgperformance = userTimingsTracker();
window.inTrack = {
  push: () => {}
};

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

const Home = Loadable({
  loader: () =>
    import(/* webpackChunkName: "home" */ "./components/pages/Home"),
  loading: Loading
});

const Registration = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "registration-view" */ "./components/pages/Registration"
    ),
  loading: Loading
});

const Analytics = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "analytics-view" */ "./components/pages/Analytics"
    ),
  loading: Loading
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
    const { location, accessToken } = this.props;
    let { mobileNumberVerified } = this.props;
    const {
      login,
      signup,
      root,
      errorPage,
      publicJD,
      otpPage,
      practice,
      home,
      addPhoneNumber,
      companyAnalytics,
      companyLanding,
      companyJobDetail
    } = routeConfig;
    if (
      !accessToken &&
      !appConstants.NO_ACCESS_TOKEN_ROUTES.includes(location.pathname)
    ) {
      this.setLandingRoute(location.pathname);
    }
    return (
      <ErrorBoundary>
        <React.Fragment>
          <GlobalTemplates />

          {navigator.onLine ? (
            <Switch>
              <Route path={practice} component={Practice} />
              <Route exact path={errorPage} component={ErrorPage} />
              <Route exact path={publicJD} component={PublicJD} />
              <Route exact path={otpPage} component={OtpPage} />
              <Route exact path={companyAnalytics} component={Analytics} />
              {((accessToken && !mobileNumberVerified) || !accessToken) && (
                <Route exact path={[login, signup, root]} component={Login} />
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
              {accessToken && (
                <Route exact path={[addPhoneNumber]} component={Registration} />
              )}
              <Route
                exact
                path={companyJobDetail}
                component={CompanyJobDetail}
              />
              <Route exact path={companyLanding} component={Company} />
              {accessToken && (
                <Route exact path={[root, home]} component={Home} />
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
