import React, { Component } from "react";
import { Redirect } from "react-router-dom";

import HelpText from "../../atoms/HelpText";
import tracker from "../../../analytics/tracker";

class UpdatePrefs extends Component {
  state = {};

  handleUpdatePrefsClick = () => {
    tracker().on("event", {
      hitName: "browse$update_preferences_clicked$card"
    });
    this.setState({ redirectToProfile: true });
  };

  render() {
    const { redirectToProfile } = this.state;
    return redirectToProfile ? (
      <Redirect
        to={{ pathname: "profile", state: { editPreferences: true } }}
      />
    ) : (
      <div>
        <HelpText
          key="skillhelp"
          text="Why this job may interest you"
          className="marginTop_24 color_mid_night semibold"
        />
        <p className="color_silver fontSize_13 marginTop_8 marginBottom_12">
          View your match and know insigths about this job by updating
          preferences.
        </p>
        <p
          className="fontSize_15 color_picton_blue"
          onClick={this.handleUpdatePrefsClick}
        >
          Update preferences to view full match
        </p>
      </div>
    );
  }
}

export default UpdatePrefs;
