import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";

import SnackBar from "../../atoms/SnackBar";
import LandscapeModeErr from "../../organisms/LandscapeModeErr";

import { closeGlobalPrompt } from "../../../sagas/ActionCreator";

class GlobalTemplatesContainer extends React.PureComponent {
  state = {};

  componentDidMount() {
    const { userBasicDetails } = this.props;
    const {
      utm_source,
      utm_campaign,
      utm_medium,
      gclid,
      fbclid,
      ref
    } = queryString.parse(window.location.search);
    if (utm_source) {
      sessionStorage.setItem("utm_source", utm_source);
    }else {
      sessionStorage.removeItem("utm_source");
    }
    if (utm_campaign) {
      sessionStorage.setItem("utm_campaign", utm_campaign);
    }else {
      sessionStorage.removeItem("utm_campaign");
    }
    if (utm_medium) {
      sessionStorage.setItem("utm_medium", utm_medium);
    }else{
      sessionStorage.removeItem("utm_medium");
    }
    if (gclid) {
      sessionStorage.setItem("gclid", gclid);
    }else{
      sessionStorage.removeItem("gclid")
    }
    if (fbclid) {
      sessionStorage.setItem("fbclid", fbclid);
    }else {
      sessionStorage.removeItem("fbclid");
    }
 
    sessionStorage.setItem("Referral URL", window.document.referrer);
    if (Math.abs(window.orientation) === 90) {
      this.setState({ isLandcapeMode: true });
    }
    window.addEventListener(
      "orientationchange",
      this.handleAppOrientationChange
    );
    // if (userBasicDetails && userBasicDetails.name) {
    //   window.clevertap.onUserLogin.push({
    //     Site: {
    //       Identity: userBasicDetails.id,
    //       Email: userBasicDetails.email
    //     }
    //   });
    // }

  }

  handleAppOrientationChange = () => {
    if (Math.abs(window.orientation) === 90) {
      this.setState({ isLandcapeMode: true });
    } else {
      this.setState({ isLandcapeMode: false });
    }
  };

  render() {
    const {
      isOpen,
      msg,
      variant,
      info,
      icon,
      messageClass,
      containerClassName,
      iconSize
    } = this.props.prompt;
    return (
      <div>
        <SnackBar
          isSnackbarOpen={isOpen}
          message={msg}
          variant={variant}
          onClose={this.props.closeGlobalPrompt}
          info={info}
          icon={icon}
          messageClassName={messageClass}
          iconSize={iconSize}
          containerClassName={containerClassName}
        />
        {this.state.isLandcapeMode && <LandscapeModeErr />}
      </div>
    );
  }
}

const mapSTP = state => ({
  prompt: state.commonData.prompt,
  userBasicDetails: state.commonData.userBasicDetails
});

const mapDTP = { closeGlobalPrompt };

export default connect(
  mapSTP,
  mapDTP
)(GlobalTemplatesContainer);
