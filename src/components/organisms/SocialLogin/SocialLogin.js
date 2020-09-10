import React, { Component } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";

import { connect } from "react-redux";
import queryString from "query-string";

import { openGlobalPrompt } from "../../../sagas/ActionCreator";

import Button from "../../atoms/Button";
import Urlconfig from "../../../constants/Urlconfig";
import routeConfig from "../../../constants/routeConfig";

import facebookLogo from "../../../assets/images/png/facebook_logo.png";
import googleLogo from "../../../assets/images/png/google_logo.png";
import { LinkedInIcon } from "../../atoms/Icon";
import { trackCleverTap } from "../../../utils/tracking";
import "./SocialLogin.scss";
import tracker from "../../../analytics/tracker";
let global_code = "";

class SocialLogin extends Component {
  componentWillReceiveProps(newState, props) {
    const { location } = newState;
    const { code, state } = queryString.parse(location.search);
    if (global_code !== code && state && state === "linkedin") {
      global_code = code;
      this.handleLinkedInResponse(code);
    }
  }
  handleLinkedInResponse = code => {
    tracker().on("event", {
      hitName: `registration$linkedin_clicked$${window.location.pathname.slice(
        1
      )}_screen`
    });

    const url = `${Urlconfig.socialLogin}/linkedin`;

    const postObj = {
      accessToken: code
    };
    this.facbookAndGoogleLogin(url, postObj, "Linked-in");
  };
  handleGoogleResponse = response => {
    const url = `${Urlconfig.socialLogin}/google`;
    this.facbookAndGoogleLogin(url, response, "Google");
  };
  facbookAndGoogleLogin = (url, response, provider) => {
    const {
      landingRoute,
      history,
      openGlobalPrompt,
      socialLogin,
      location
    } = this.props;
    const { state } = queryString.parse(location.search);
    let _landingRoute = landingRoute;
    if (state && state === "linkedin") {
      const linkedinLandingRoute = sessionStorage.getItem(
        "linkedinLandingRoute"
      );
      if (linkedinLandingRoute) {
        _landingRoute = linkedinLandingRoute;
      }
      sessionStorage.removeItem("linkedinLandingRoute");
    }
    if (response.accessToken) {
      const data = {
        token: response.accessToken
      };
      const promise = new Promise((resolve, reject) => {
        socialLogin(resolve, reject, data, url, "socialLogin");
      });
      promise.then(({ user, screens }) => {
        if (user && !user.mobileNumberVerified) {
          openGlobalPrompt(
            `${provider} sign-in successful!`,
            "success",
            null,
            "Sociallogintick",
            "bold",
            16
          );
          history.push(`${routeConfig.addPhoneNumber}?social=true`, {
            heading: "Add your mobile number to your account",
            resendUrl: Urlconfig.sendSocialLoginOTP,
            data: data,
            validateUrl: Urlconfig.validateSocialLoginOTP,
            logoutonBack: true
          });
        } else if (user && user.profile.isUserProfileCompleted) {
          if (_landingRoute && _landingRoute !== routeConfig.jobs) {
            history.push(_landingRoute);
          }
          // else {
          // history.push(routeConfig.jobs, user);
          // }
        } else {
          history.push(
            routeConfig.regWithId.replace(":id", screens.data.firstScreenId)
          );
        }
        this.setState({ code: "" });
      });
      promise.catch(err => {
        if (err.status === 423) {
          history.push(routeConfig.inviteOnly);
        } else {
          openGlobalPrompt(
            err.message || "Login / Registration Failed",
            "error"
          );
          this.setState({ code: "" });
        }
      });
    }
  };
  handleFacebookRespone = (response, event) => {
    trackCleverTap(
      `FacebookClicked_${window.location.pathname.slice(1)}Screen`
    );
    const url = `${Urlconfig.socialLogin}/facebook`;
    this.facbookAndGoogleLogin(url, response, "Facebook");
  };

  handleLinkedInClick = () => {
    const { pageName, landingRoute } = this.props;
    if (pageName === "signup") {
      trackCleverTap("LinkedinClicked_SignUpScreen");
      tracker().on("event", {
        hitName: "registration$linkedin_clicked$signup_screen"
      });
    }
    if (pageName === "login") {
      trackCleverTap("LinkedinClicked_SignInScreen");
      tracker().on("event", {
        hitName: "registration$linkedin_clicked$login_screen"
      });
    }
    if (landingRoute) {
      sessionStorage.setItem("linkedinLandingRoute", landingRoute);
    } else {
      sessionStorage.removeItem("linkedinLandingRoute");
    }
    const redirectUri = `${Urlconfig.codeBase}/login`;
    const clientId = "815tm15suvrghh";
    const scope = "r_liteprofile r_emailaddress";
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=linkedin`;
    window.location.href = url;
  };

  trackGoogleLogin = () => {
    tracker().on("event", {
      hitName: `registration$google_clicked$${this.props.pageName}_screen`
    });
    trackCleverTap(`GoogleClicked_${this.props.pageName}Screen`);
  };

  trackFacebookLogin = () => {
    tracker().on("event", {
      hitName: `registration$facebook_clicked$${this.props.pageName}_screen`
    });
  };

  render() {
    return (
      <div className="SocialLogin__CTAContainer">
        <GoogleLogin
          redirectUri="http://localhost:3000"
          clientId="387451133785-kbbknocb89d2lph41djn0ela0bi6fbdo.apps.googleusercontent.com"
          render={renderProps => (
            <Button
              type="button"
              onClick={() => {
                this.trackGoogleLogin();
                renderProps.onClick();
              }}
              className="SocialLogin__CTA googleLogin"
            >
              <img
                className="maxWidth_24 marginRight_12"
                alt="google"
                src={googleLogo}
              />
            </Button>
          )}
          onSuccess={this.handleGoogleResponse}
          onFailure={this.handleGoogleResponse}
        />
        <FacebookLogin
          appId="362601874668336"
          autoLoad={false}
          callback={this.handleFacebookRespone}
          fields="name,email,picture"
          redirectUri={window.location.href}
          disabled={true}
          version="3.2"
          render={renderProps => (
            <Button
              type="button"
              onClick={e => {
                e.preventDefault();
                this.trackFacebookLogin();
                return renderProps.onClick();
              }}
              className="SocialLogin__CTA facebookLogin"
            >
              <img
                className="maxWidth_24 marginRight_12"
                alt="facebook"
                src={facebookLogo}
              />
            </Button>
          )}
        />

        <Button
          type="button"
          className="SocialLogin__CTA"
          onClick={this.handleLinkedInClick}
        >
          <LinkedInIcon />
        </Button>
      </div>
    );
  }
}

export default connect(
  null,
  { openGlobalPrompt }
)(SocialLogin);
