import React, { Component } from "react";
import { connect } from "react-redux";
import queryString from "query-string";
import RadioGroup from "../../../../molecules/RadioGroup";
import PageHeading from "../../../../atoms/PageHeading";
import Button from "../../../../atoms/Button";
import routeConfig from "../../../../../constants/routeConfig";
import { getNextScreen } from "../../saga/ActionCreator";
import { updateUserProfile } from "../../../../../sagas/ActionCreator";
import RadioGroupModal from "../../../../templates/RadioGroupModal";

import { trackCleverTap } from "../../../../../utils/tracking";
import tracker from "../../../../../analytics/tracker";

class JobSearchStatus extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profilePrivacyModalOpen: false
    };
    this.isEdit =
      (props.history &&
        props.history.location.state &&
        props.history.location.state.isEdit) ||
      this.props.history.location.pathname.includes("profile");
  }

  componentDidMount() {
    window.onpopstate = () => {
      if (window.location.pathname.includes("otp")) {
        this.props.history.push(routeConfig.profile);
      }
    };
  }

  handleProfilePrivacyChange = event => {
    event.preventDefault();
    trackCleverTap("reg_ProfileVisibilityChangeClicked");
    this.setState({
      profilePrivacyModalOpen: true
    });
  };
  handleCloseModal = () => {
    if (this.state.profilePrivacyModalOpen) {
      this.setState({
        profilePrivacyModalOpen: false
      });
    }
  };
  handleJobSearchRadioChange = selectedValue => {
    this.props.updateUserProfile({
      jobSearchStatus: selectedValue
    });
  };
  handleProfilePrivacyRadioChange = selectedValue => {
    const { profile } = this.props;
    if (
      profile.preferences &&
      profile.preferences.profilePrivacy &&
      profile.preferences.profilePrivacy !== selectedValue
    ) {
      this.handleCloseModal();
    }
    const updatedPreferences = profile.preferences ? profile.preferences : {};
    updatedPreferences.profilePrivacy = selectedValue;
    updatedPreferences.profilePrivacyDescription =
      selectedValue === "public"
        ? "Let companies view my full profile"
        : "Only companies I apply to can see my profile";
    this.props.updateUserProfile({
      preferences: updatedPreferences
    });
  };

  handleNextButtonClick = () => {
    const { id, profile } = this.props;
    const { jobSearchStatus, preferences } = profile;
    const isUserProfileCompleted = profile.isUserProfileCompleted;
    const isCvExist = profile.fileName ? true : false;
    const profilePrivacy =
      preferences && preferences.profilePrivacy
        ? preferences.profilePrivacy
        : "public";
    const submitData = {
      currentScreenId: id,
      profile: {
        jobSearchStatus,
        preferences: {
          profilePrivacy
        }
      },
      userProfileId: profile.id
    };
    const updatedPreferences = profile.preferences ? profile.preferences : {};
    updatedPreferences.profilePrivacy = profilePrivacy;
    this.props.updateUserProfile({
      jobSearchStatus,
      preferences: updatedPreferences
    });
    const promise = new Promise((resolve, reject) => {
      this.props.getNextScreen(submitData, resolve, reject, this.isEdit);
    });
    promise.then(res => {
      if (this.isEdit) {
        tracker().on("event", {
          hitName: "profile$update_clicked$edit_job_search_status"
        });
        tracker().on("ctapEvent", {
          hitName: "edit_profile_privacy_next_click",
          payload: {
            page_name: "js_edit_profile_privacy"
          }
        });

        tracker().on("ctapProfile", {
          hitName: "edit_profile_privacy_next_click",
          payload: {
            ...this.getParsedProfileObj(submitData.profile),
            is_profile_complete: isUserProfileCompleted,
            does_cv_exist: isCvExist
          }
        });
        this.props.history.push(routeConfig.profile);
      } else {
        tracker().on("event", {
          hitName: "registrations$next_button_clicked$job_search_status"
        });
        tracker().on("ctapEvent", {
          hitName: "profile_privacy_next_click",
          payload: {
            page_name: "js_profile_privacy"
          }
        });

        tracker().on("ctapProfile", {
          hitName: "profile_privacy_next_click",
          payload: {
            ...this.getParsedProfileObj(submitData.profile),
            is_profile_complete: isUserProfileCompleted,
            does_cv_exist: isCvExist
          }
        });
        this.props.history.push(routeConfig.regWithId.replace(":id", res));
      }
    });
    promise.catch(err => {});
  };

  getParsedProfileObj = profileObj => {
    Object.assign(profileObj, profileObj.preferences);
    delete profileObj.preferences;
    return profileObj;
  };

  setPrevValue = (value, config) => {
    config.radioList &&
      config.radioList.map(radioItem => {
        if (radioItem.value === value) {
          radioItem.isDefault = true;
        } else {
          radioItem.isDefault = false;
        }
        return radioItem;
      });
    return config;
  };
  handleBackClick = () => {
    const isReg = this.props.history.location.pathname.includes("registration");
    // const { prevRoute } = queryString.parse(location.search);
    if (isReg) {
      this.props.history.goBack();
    } else {
      this.props.history.push({
        pathname: routeConfig.profile,
        search: ""
      });
    }
  };

  render() {
    const { profilePrivacyModalOpen } = this.state;
    const { profile } = this.props;
    let { profilePrivacyRadioConfig, jobSearchRadioConfig } = this.props;
    if (profile.jobSearchStatus) {
      jobSearchRadioConfig = this.setPrevValue(
        profile.jobSearchStatus,
        jobSearchRadioConfig
      );
    }
    if (profile.preferences && profile.preferences.profilePrivacy) {
      profilePrivacyRadioConfig = this.setPrevValue(
        profile.preferences.profilePrivacy,
        profilePrivacyRadioConfig
      );
    }
    const profilePrivacyDescription =
      profile.preferences && profile.preferences.profilePrivacyDescription
        ? profile.preferences.profilePrivacyDescription
        : "Let companies view my full profile";
    return (
      <div>
        <RadioGroup
          handleRadioChange={this.handleJobSearchRadioChange}
          {...jobSearchRadioConfig}
        />
        <PageHeading
          title={"Your Profile Visibility"}
          className="profilePrivacyHeading"
        />
        <p className="profilePrivacyDescription">
          <span className="marginRight_8">{profilePrivacyDescription}</span>
          <button
            className="profilePrivacyChangeButton"
            onClick={this.handleProfilePrivacyChange}
            id="profilePrivacyChangeButton"
          >
            Change
          </button>
        </p>
        <RadioGroupModal
          open={profilePrivacyModalOpen}
          closeModal={this.handleCloseModal}
          config={profilePrivacyRadioConfig}
          handleRadioChange={this.handleProfilePrivacyRadioChange}
          isCancleButton={true}
          title="Profile visibility"
          slideUp
        />

        <div className={`fixedToBottom spreadHr `}>
          <Button
            type="link hasHover"
            onClick={this.handleBackClick.bind(this)}
          >
            <span className="nav_arrow prev">{""}</span>
          </Button>
          <Button
            type="link hasHover"
            disabled={!profile.jobSearchStatus}
            onClick={this.handleNextButtonClick}
            id="skillsNextCTA"
          >
            <span className={`nav_arrow secondary`}>{""}</span>
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ registrationData, commonData }) => ({
  profile: commonData.userDetails.profile,
  experimentId: registrationData.experimentId,
  variationId: registrationData.variationId
});

export default connect(
  mapStateToProps,
  { getNextScreen, updateUserProfile }
)(JobSearchStatus);
