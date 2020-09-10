import React, { Component } from "react";

import BackButton from "../../../molecules/BackButton";
import PageHeading from "../../../atoms/PageHeading";
import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import { trackCleverTap, trackCT } from "../../../../utils/tracking";
import tracker from "../../../../analytics/tracker";

export default class Setting extends Component {
  handleOnClickLogout = () => {
    tracker().on("event", { hitName: "profile$log_out_clicked$settings" });
    trackCleverTap("LogOutClicked_settings");
    trackCT("LogOutClicked_settings");
    this.props.userLogout();
    localStorage.setItem("auth","0");
    this.props.history.push(routeConfig.login);
  };
  handleBackClick = () => {
    tracker().on("event", { hitName: "profile$back_button_clicked$settings" });
    trackCleverTap("BackClicked_settings");
    this.props.history.push(routeConfig.profile);
  };
  handlePrivacyPolicyClick = () => {
    tracker().on("event", {
      hitName: "profile$privacy_policy_clicked$settings"
    });
    trackCleverTap("TnCClicked_settings");
  };

  render() {
    return (
      <div className="Setting">
        <div className="Setting__heading">
          <BackButton
            action={() => {
              this.handleBackClick();
            }}
          />
          <PageHeading title="Settings" />
        </div>
        <div className="Setting__content">
          <a
            className="Setting__Link"
            href="https://www.bigshyft.com/policies/index.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={this.handlePrivacyPolicyClick}
          >
            BigShyft Policies
          </a>
          <br />
          <Button
            type="link"
            onClick={this.handleOnClickLogout}
            className="Setting__Link"
          >
            Logout
          </Button>

          <div className="marginTop_32 color_dusk fontSize_11">
            If you face any issues or have any bugs to report, send us an email
            at{" "}
            <span className="color_dodger_blue">
              <a href="mailto:support@bigshyft.com" target="_top">
                support@bigshyft.com
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  }
}
