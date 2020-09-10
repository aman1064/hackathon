import React, { Component } from "react";
import queryString from "query-string";
import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import SocialLogin from "../../../organisms/SocialLogin";
import { trackCleverTap } from "../../../../utils/tracking";
import LoginForm from "./LoginForm";

import LogoHeader from "../../../organisms/LogoHeader/LogoHeader";
import Loading from "../../../atoms/Loading";
import { addLoading, removeLoading } from "../../../../utils/buttonUtils";
import Urlconfig from "../../../../constants/Urlconfig";
import tracker from "../../../../analytics/tracker";

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      showSearchBarModal: false
    };
    this._isMounted = false;
    this.landingRoute =
      this.props.location.state && this.props.location.state.landingRoute;
  }

  componentWillMount() {
    const { handleFormValidState } = this.props;
    handleFormValidState({ form: "login", isValid: true, errorMsg: "" });
  }

  componentDidMount() {
    const { accessToken, location, history } = this.props;
    const isContestApply =
      location.state && location.state.route === "contestApply";
    if (accessToken && isContestApply) {
      history.goForward();
    }
    if (accessToken) {
      /* in case of social signup we have accesstoken before OTP ,
       in this case if user enters /login in browser then we should 
       delete everything for that user */
      localStorage.clear();
    }
    window.__bgperformance.pageMeasure();
    this._isMounted = true;
  }

  componentDidUpdate() {
    const { location } = this.props;
    const isContestApply =
      location.state && location.state.route === "contestApply";
    if (this._isMounted) {
      if (isContestApply) {
        tracker().on("ctapPageView", {
          hitName: "pv_login_contest",
          payload: {
            page_name: "js_login_contest"
          }
        });
      } else {
        tracker().on("ctapPageView", {
          hitName: "pv_login",
          payload: {
            page_name: "js_login"
          }
        });
      }
    }
    this._isMounted = false;
  }
  handleSubmit = e => {
    e.preventDefault();
    const {
      loginForm,
      handleFormValidState,
      location,
      accessToken,
      history
    } = this.props;
    const { values: loginFormValues } = loginForm;
    const isContestApply =
      location.state && location.state.route === "contestApply";
    if (isContestApply) {
      tracker().on("ctapEvent", {
        hitName: "login_contest",
        payload: {
          page_name: "js_login_contest"
        }
      });
    } else {
      tracker().on("event", {
        hitName: "registration$login_clicked$login_screen"
      });

      tracker().on("ctapEvent", {
        hitName: "login_page_login_click",
        payload: {
          page_name: "js_login"
        }
      });
    }

    const submitBtn = addLoading("loginButton");
    const loginData = {
        mobileNumber: loginFormValues.mobileNumber
      },
      promise = new Promise((resolve, reject) => {
        this.props.userLogin(resolve, reject, loginData);
      });

    promise.then(res => {
      tracker().on("event", {
        hitName: "registration$login_success$login_screen"
      });

      localStorage.setItem("otpTimerDuration", 30);

      this.props.setInteractionId(res.data.interactionId);

      removeLoading(submitBtn);
      if (location.state && location.state.route === "contestApply") {
        this.props.history.push(routeConfig.otpPage, {
          route: "contestApply",
          isEditMobileNumber: true,
          resendUrl: Urlconfig.login,
          data: loginData,
          validateUrl: Urlconfig.validateLoginOtp,
          from: location.state.from
        });
      } else {
        this.props.history.push(routeConfig.otpPage, {
          route: "login",
          isEditMobileNumber: true,
          resendUrl: Urlconfig.login,
          data: loginData,
          validateUrl: Urlconfig.validateLoginOtp,
          landingRoute: this.landingRoute,
          ...queryString.parse(location.search)
        });
      }
    });
    promise.catch(err => {
      tracker().on("event", {
        hitName: "registration$login_fail$login_screen"
      });
      handleFormValidState({
        form: "login",
        isValid: false,
        errorMsg: err.message
      });
    });

    removeLoading(submitBtn);
  };

  handleOnClickRegister = () => {
    tracker().on("event", {
      hitName: `registration$register_clicked$login_screen`
    });
    trackCleverTap("SignUpClicked_SignInScreen");
    this.props.history.push(
      `${routeConfig.signup}${this.props.history.location.search}`
    );
  };
  handleButtonClick = () => {
    this.setState({
      showSearchBarModal: true
    });
  };
  handleCloseModal = () => {
    this.setState({
      showSearchBarModal: false
    });
  };
  handleOpenOtpPage = () => {
    this.props.history.push(routeConfig.otpPage);
  };

  redirectToContestSignup = () => {
    const { location, history } = this.props;
    history.push(routeConfig.practiceSignup, {
      from: location.state.from
    });
  };

  render() {
    const { code } = queryString.parse(window.location.search);
    const { loginForm = {}, location } = this.props;

    const {
      isValid: isLoginFormValid,
      errorMsg: loginFormErrorMsg
    } = loginForm;
    const isContestApply =
      location.state && location.state.route === "contestApply";

    return code !== "" ? (
      <div className="LoginView">
        <LogoHeader
          isSmallLogo
          hitName="registration$bigshyft_logo_clicked$login_screen"
        >
          {!isContestApply && (
            <Button type="link" onClick={this.handleOnClickRegister}>
              Sign up
            </Button>
          )}
          {isContestApply && (
            <Button type="link" onClick={this.redirectToContestSignup}>
              Sign up
            </Button>
          )}
        </LogoHeader>
        <h1 className="Login__Header extra_bold">
          {" "}
          Handpicked jobs brought to you!
        </h1>
        <p className="LoginView__loginSignupRedirect">
          {`Join 1000s like you who've found their dream jobs with top companies like Amazon, Ola, Oyo, Hotstar and many more`}
        </p>
        {!isContestApply && (
          <SocialLogin
            {...this.props}
            landingRoute={this.landingRoute}
            pageName="login"
          />
        )}
        <p
          className={`marginTop_20 marginBottom_132  ${
            !isContestApply ? "smButtonSeparator" : ""
          }`}
        >
          {!isContestApply ? "or" : ""}
        </p>
        <LoginForm
          onSubmit={this.handleSubmit}
          isValid={isLoginFormValid}
          errorMessage={loginFormErrorMsg}
        />
      </div>
    ) : (
      <Loading />
    );
  }
}

export default LoginView;
