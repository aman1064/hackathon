import React, { Component } from "react";
import OtpInput from "../../../templates/OTP/OtpInput";
import "../OtpPage.scss";
import Button from "../../../atoms/Button";
import LogoHeader from "../../../organisms/LogoHeader";
import routeConfig from "../../../../constants/routeConfig";
import {
  trackCleverTap,
  filterJobDetailsForCleverTap
} from "../../../../utils/tracking";
import getSessionStorage from "../../../../utils/getSessionStorage";
import Timer from "../../../organisms/Timer";
import getKey from "../../../../utils/getKey";
import services from "../../../../utils/services";
import { getUrl } from "../../../../utils/getUrl";
import Urlconfig from "../../../../constants/Urlconfig";
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
    tracker().on("event", {
      hitName: "registration$login_success$login_screen"
    });

    //const {prevRoute } = this.state;
    // if(prevRoute === "signup"){
    if (res.user && res.user.profile.isUserProfileCompleted) {
      const isQuickApplyFlow = getSessionStorage("isQuickApplyFlow");
      let funcData = {};
      if (isQuickApplyFlow && (this.props.id || this.landingRoute)) {
        // const { id, jobId, viewJobFromMailer } = this.props;
        const id = this.props.id || this.props.location.state.id;
        const jobId = this.props.jobId || this.props.location.state.jobId;
        funcData = {
          id,
          jobId
        };
        const userVerifyUrl = `${Urlconfig.userVerify}?id=${id}`;
        const pageName = "login";
        this.props.userVerify(userVerifyUrl, null, null, pageName, this.props);
        this.props.userVerifyForceRecommend(funcData, this.props);
        this.props.forceRecommendGetJobDetails(funcData, this.props);
        tracker().on("ctapEvent", {
          hitName: "signup_success",
          payload: {
            flow: "quick_apply_flow"
          }
        });
        tracker().on("ctapProfile", {
          hitName: "signup_success",
          payload: {
            profile_created: true,
            is_profile_complete: true,
            does_cv_exist: true
          }
        });
      } else {
        if (this.landingRoute) {
          this.landingRoute = this.landingRoute.includes("?")
            ? this.landingRoute + "&prevRoute=otp"
            : this.landingRoute + "?prevRoute=otp";
        }
        tracker().on("ctapEvent", {
          hitName: "login_success",
          payload: {
            flow: "product_flow"
          }
        });
        tracker().on("ctapProfile", {
          hitName: "login_success"
        });
        this.props.history.push(this.landingRoute || routeConfig.jobs);
      }
    } else if (res.user && res.user.jobId) {
      this.props.setJobId(res.user.jobId);

      this.props.history.push({
        pathname: routeConfig.jobs,
        search: `?jobId=${res.user.jobId}`
      });
    } else {
      tracker().on("ctapEvent", {
        hitName: "signup_success",
        payload: {
          flow: "product_flow"
        }
      });
      tracker().on("ctapProfile", {
        hitName: "signup_success",
        payload: {
          profile_created: true,
          is_profile_complete: true,
          does_cv_exist: true
        }
      });

      this.props.history.push(
        routeConfig.regWithId.replace(":id", res.screens.data.firstScreenId)
      );
    }
  };
  handlePrevRouteInstaApply = otp_res => {
    const { isUserProfileCompleted } = otp_res.user.profile;
    const {
      isAlreadyRegistered,
      data,
      jobDetails = {},
      jobId
    } = this.props.location.state;

    if (isAlreadyRegistered) {
      services.post(getUrl(Urlconfig.postUpdateUserProfile), data.profileV2);
    }
    new Promise((resolve, reject) => {
      this.props.handlepublicJDApply(
        resolve,
        reject,
        isUserProfileCompleted,
        jobId
      );
    }).then(() => {
      if (isUserProfileCompleted) {
        this.props.history.push(routeConfig.jobs);
        tracker().on("ctapEvent", {
          hitName: "login_success",
          payload: {
            flow: "instaapply_flow"
          }
        });
        tracker().on("ctapEvent", {
          hitName: "apply_success",
          payload: {
            from_page: "public_jd",
            ...filterJobDetailsForCleverTap(jobDetails)
          }
        });
        tracker().on("ctapProfile", {
          hitName: "login_success",
          payload: {}
        });
      } else {
        tracker().on("ctapEvent", {
          hitName: "signup_success",
          payload: {
            flow: "instaapply_flow"
          }
        });

        tracker().on("ctapProfile", {
          hitName: "signup_success",
          payload: {
            ...data,
            ...data.profileV2,
            ...data.profileV2.latestCompanyDetails,
            is_profile_complete: isUserProfileCompleted ? true : false,
            does_cv_exist: true,
            profile_created: true
          }
        });
        this.props.history.push(
          `${routeConfig.instaApplyUpdate.replace(
            ":jobId",
            this.props.history.location.state.jobId
          )}${this.props.location.search}`
        );
      }
    });
  };
  handlePrevRouteSocialLogin = res => {
    if (res.user.profile.isUserProfileCompleted) {
      tracker().on("ctapEvent", {
        hitName: "login_success",
        payload: {
          flow: "product_flow"
        }
      });
      this.props.history.push(routeConfig.jobs);
    } else {
      tracker().on("ctapEvent", {
        hitName: "signup_success",
        payload: {
          flow: "product_flow"
        }
      });

      tracker().on("ctapProfile", {
        hitName: "signup_success",
        payload: {
          profile_created: true,
          is_profile_complete: false,
          does_cv_exist: res.user.profile.fileName ? true : false
        }
      });
      this.props.history.push(
        routeConfig.regWithId.replace(":id", res.screens.data.firstScreenId)
      );
    }
  };
  handlePrevRouteUserConsent = () => {
    tracker().on("ctapEvent", {
      hitName: "signup_success",
      payload: {
        flow: "profile_activation_flow"
      }
    });

    tracker().on("ctapProfile", {
      hitName: "signup_success",
      payload: {
        profile_created: true,
        created_by: "Agent"
      }
    });
    const trackerData = {
      updated_by: "Agent",
      flow: "profile_activation_flow"
    };
    new Promise((resolve, reject) => {
      this.props.postCompletedProfile(resolve, reject, trackerData);
    }).then(() => {
      this.props.history.push(routeConfig.jobs);
    });
  };
  handlePrevRouteQuickApply = res => {
    const isQuickApply = getSessionStorage("isQuickApply");
    const profileCompletePromise = new Promise((resolve, reject) => {
      this.props.postCompletedProfile(resolve, reject);
    });

    const forceRecommendPromise = new Promise((resolve, reject) => {
      if (isQuickApply) {
        this.props.forceRecommendAndApply(resolve, reject);
      } else {
        resolve();
      }
    });

    Promise.all([profileCompletePromise, forceRecommendPromise]).then(() => {
      tracker().on("ctapEvent", {
        hitName: "signup_success",
        payload: {
          flow: "quick_apply_flow"
        }
      });
      tracker().on("ctapProfile", {
        hitName: "signup_success",
        payload: {
          profile_created: true,
          is_profile_complete: true,
          does_cv_exist: true
        }
      });
      if (isQuickApply) {
        tracker().on("event", {
          hitName: "QAF$save_and_apply_success$naukri_data_screen_apply"
        });

        this.props.history.push(routeConfig.quickApplySplashScreen);
        setTimeout(
          function(props, routeConfig) {
            props.history.push({
              pathname: routeConfig.jobs,
              search: "?isBackNotAllowed=true"
            });
          }.bind(this, this.props, routeConfig),
          2000
        );
      } else {
        tracker().on("event", {
          hitName: "QAF$view_jobs_clicked$naukri_data_screen_viewmore"
        });
        this.props.history.push(routeConfig.jobs);
      }
    });
  };
  handleRedirectBack = () => {
    const { location, history } = this.props;
    tracker().on("ctapProfile", {
      hitName: "login_success"
    });
    history.replace(get(location, "state.from"));
  };
  handleNextButtonClick = () => {
    tracker().on("event", {
      hitName: "registration$otp_submit_clicked$enter_otp_screen"
    });
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
      tracker().on("event", {
        hitName: "registration$otp_submit_success$enter_otp_screen"
      });
      trackCleverTap("OTPsubmit_OTPscreen", {
        OTPconfirm_clickedStatus: "Success"
      });
      tracker().on("ctapEvent", {
        hitName: "otp_verification_next_click",
        payload: {
          page_name: "js_otp_verification",
          status: "success"
        }
      });
      switch (prevRoute) {
        case "instaApply":
          this.handlePrevRouteInstaApply(res);
          break;
        case "socialLogin":
          this.handlePrevRouteSocialLogin(res);
          break;
        case "quickApply":
          this.handlePrevRouteQuickApply(res);
          break;
        case "UserConsent":
          this.handlePrevRouteUserConsent(res);
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
      tracker().on("event", {
        hitName: "registration$otp_submit_fail$enter_otp_screen"
      });
      tracker().on("ctapEvent", {
        hitName: "otp_verification_next_click",
        payload: {
          page_name: "js_otp_verification",
          status: "fail"
        }
      });
      this.props.openGlobalPrompt(err.message || "otp submit Failed", "error");
    });
  };
  handleResendOtpClick = () => {
    tracker().on("event", {
      hitName: `registration$resend_otp_clicked$enter_otp_screen`
    });
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
