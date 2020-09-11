import React, { Component } from "react";
import OtpInput from "../../../templates/OTP/OtpInput";
import "../OtpPage.scss";
import Button from "../../../atoms/Button";
import LogoHeader from "../../../organisms/LogoHeader";
import routeConfig from "../../../../constants/routeConfig";
import { filterJobDetailsForCleverTap } from "../../../../utils/tracking";
import Timer from "../../../organisms/Timer";
import getKey from "../../../../utils/getKey";
import tracker from "../../../../analytics/tracker";
import { get } from "../../../../utils/jsUtils";

export default class OtpView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numInputs: props.numInputs || 4,
      otpValue: "",
      isNextButtonEnabled: false,
      resendOtpTime: "",
      mobileNumber: "",
      isEditMobileNumber: false,
      resendUrl: "",
      validateUrl: "",
      route: "",
      resendData: null,
      isResendButtonEnabled: false
    };
    this._isMounted = false;
    this.landingRoute =
      this.props.location.state && this.props.location.state.landingRoute;
  }
  componentWillUnmount() {
    this.props.history.goForward();
  }
  componentDidMount = () => {
    let { isResendButtonEnabled } = this.state;
    const { location, jobDetails } = this.props;
    const { isEditMobileNumber, data, resendUrl, route, validateUrl } =
      location.state || {};
    const { mobileNumber } = data || {};
    const otpTimerDuration = localStorage.getItem("otpTimerDuration");
    if (otpTimerDuration === "0") {
      isResendButtonEnabled = true;
    }
    if (otpTimerDuration && otpTimerDuration !== "0") {
      localStorage.setItem("otpTimerDuration", `${otpTimerDuration - 1}`);
    }
    window.__bgperformance.pageMeasure();
    this.setState({
      mobileNumber,
      isEditMobileNumber: isEditMobileNumber,
      resendUrl,
      prevRoute: route,
      validateUrl,
      resendData: data,
      isResendButtonEnabled
    });
    this._isMounted = true;
  };
  componentDidUpdate() {
    const { location, jobDetails } = this.props;
    const { route } = location.state || {};
    if (this._isMounted) {
      if (route === "instaApply") {
        tracker().on("ctapPageView", {
          hitName: "pv_instaapply_otp_verification",
          payload: {
            page_name: "js_instaapply_otp_verification",
            ...filterJobDetailsForCleverTap(jobDetails)
          }
        });
      } else {
        tracker().on("ctapPageView", {
          hitName: "pv_otp_verification",
          payload: {
            page_name: "js_otp_verification"
          }
        });
      }
    }
    this._isMounted = false;
  }

  handleEditClick = () => {
    tracker().on("event", {
      hitName: "registration$edit_number_clicked$enter_otp_screen"
    });
    this.props.history.push(
      routeConfig.addPhoneNumber,
      this.props.location.state
    );
  };
  handlePrevRouteLogin = res => {
    if (res.user) {
      if (this.landingRoute) {
        this.landingRoute = this.landingRoute.includes("?")
          ? this.landingRoute + "&prevRoute=otp"
          : this.landingRoute + "?prevRoute=otp";
      }
      this.props.history.push(this.landingRoute || routeConfig.home);
    }
  };

  handlePrevRouteSocialLogin = res => {
    this.props.history.push(routeConfig.home);
  };

  handleRedirectBack = () => {
    const { location, history } = this.props;
    history.replace(get(location, "state.from"));
  };
  handleNextButtonClick = () => {
    const { otpValue, validateUrl, prevRoute } = this.state;
    this.setState({ isNextButtonEnabled: false });
    const { interactionId } = this.props;
    const postObj = {
      interactionId,
      otp: otpValue
    };
    const isScreenConfigRequired =
      prevRoute !== "quickApply" && prevRoute !== "instaApply";
    const promise = new Promise((resolve, reject) => {
      this.props.validateOTP({
        url: validateUrl,
        data: postObj,
        isScreenConfigRequired,
        resolve,
        reject
      });
    });
    promise.then(res => {
      this.setState({ isNextButtonEnabled: true });
      const openViduObj = { item: { userName: "Dummy user" } };
      localStorage.setItem("openviduCallNickname", JSON.stringify(openViduObj));
      switch (prevRoute) {
        case "instaApply":
          this.handlePrevRouteInstaApply(res);
          break;
        case "socialLogin":
          this.handlePrevRouteSocialLogin(res);
          break;
        case "contestApply":
        case "redirectBack":
          this.handleRedirectBack(res);
          break;
        case "login":
        default:
          this.handlePrevRouteLogin(res);
      }
    });
    promise.catch(err => {
      this.setState({ isNextButtonEnabled: true });
      this.props.openGlobalPrompt(err.message || "otp submit Failed", "error");
    });
  };
  handleResendOtpClick = () => {
    const { resendUrl, resendData } = this.state;
    localStorage.setItem("otpTimerDuration", 30);
    const promise = new Promise((resolve, reject) => {
      this.props.resendOTP({
        url: resendUrl,
        data: resendData,
        resolve,
        reject
      });
    });
    promise.then(res => {
      this.props.setInteractionId(res.interactionId);
      this.setState({
        isResendButtonEnabled: false
      });
    });
  };
  handleOtpOnChange = otpValue => {
    this.setState({
      otpValue,
      isNextButtonEnabled: otpValue.length === 4 ? true : false
    });
  };
  onTimerEnd = () => {
    localStorage.setItem("otpTimerDuration", 0);
    this.setState({ isResendButtonEnabled: true });
  };
  saveTimerDuration(duration) {
    localStorage.setItem("otpTimerDuration", duration);
  }
  getTimerDuration() {
    return parseInt(localStorage.getItem("otpTimerDuration"), 10) || 0;
  }

  handleTimerInBackground = () => {
    window.clearInterval(window.timerId);
    if (this.getTimerDuration()) {
      window.decreaseTime = () => {
        const currentTime = this.getTimerDuration();
        if (currentTime === 0) {
          window.clearInterval(window.timerId);
        } else {
          this.saveTimerDuration(currentTime - 1);
        }
      };
      window.timerId = window.setInterval(window.decreaseTime, 1000);
    }
  };

  render() {
    const {
      numInputs,
      otpValue,
      isNextButtonEnabled,
      mobileNumber,
      isEditMobileNumber,
      isResendButtonEnabled
    } = this.state;
    return (
      <div>
        <LogoHeader
          isSmallLogo={true}
          hitName="registration$bigshyft_logo_clicked$enter_otp_screen"
        />
        <div className="otpView">
          <div className="otpPageTitle">
            <p>
              {`OTP (One Time Password) has been sent to your phone number `}
              <span className="otpPageTitle__mobileNumber">{mobileNumber}</span>
              {isEditMobileNumber && (
                <button
                  className="otpPageTitle__editButton"
                  onClick={this.handleEditClick}
                  id="editPhNo"
                >
                  Edit
                </button>
              )}
            </p>
          </div>
          <p className="otpHeading">Confirm OTP</p>
          <OtpInput
            onChange={this.handleOtpOnChange}
            numInputs={numInputs}
            value={otpValue}
            inputStyle={"otpInput"}
            shouldAutoFocus={true}
          />
          <div className="resendOtp">
            <button
              disabled={!isResendButtonEnabled}
              className="resendOtp__button"
              onClick={this.handleResendOtpClick}
              id="resendOTP"
            >
              Resend OTP
            </button>
            {!isResendButtonEnabled && (
              <div className="resendOtp__timer">
                <Timer
                  duration={this.getTimerDuration()}
                  onTimerEnd={this.onTimerEnd}
                  id={getKey()}
                  onTimeChange={this.saveTimerDuration}
                  onUnMount={this.handleTimerInBackground}
                  mode="otp"
                />
              </div>
            )}
          </div>
          <div className={`fixedToBottom spreadHr`}>
            <Button
              disabled={!isNextButtonEnabled}
              className="marginLeft_auto"
              onClick={this.handleNextButtonClick}
              type="link hasHover"
              id="formNextButton"
            >
              <span className={`nav_arrow secondary`}>{""}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
