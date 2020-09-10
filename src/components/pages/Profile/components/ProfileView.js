import React, { Component } from "react";
import { Link } from "react-router-dom";
import PageHeading from "../../../atoms/PageHeading";
import LogoHeader from "../../../organisms/LogoHeader";

import CompanyDetailsItem from "../../../organisms/CompanyDetails/CompanyDetailsItem";
import { SettingsIcon } from "../../../atoms/Icon";
import "../Profile.scss";

import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import NoProfile from "./NoProfile";
import Loading from "../../../atoms/Loading";
import services from "../../../../utils/services";
import Urlconfig from "../../../../constants/Urlconfig";
import { getUrl } from "../../../../utils/getUrl";
import tracker from "../../../../analytics/tracker";

export default class ProfileView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToNoProfilePage: false
    };
    this._isRenderedOnce = false;
  }

  componentDidMount() {
    services
      .get(Urlconfig.noticePeriod, { apiLabel: "Notice Period" })
      .then(res => {
        this.setState({ noticePeriod: res.data });
      });
    this.getApiData.apply(this);

    window.onpopstate = () => {
      if (window.location.pathname.includes("otp")) {
        this.props.history.push(routeConfig.profile);
      }
    };
  }

  componentDidUpdate() {
    if (this._isRenderedOnce) {
      window.__bgperformance.pageMeasure();
    }
    this._isRenderedOnce = false;
  }

  getApiData = () => {
    const promise = new Promise((resolve, reject) => {
      this.props.getUserProfile(resolve, reject);
    });

    promise.then(() => {
      this._isRenderedOnce = true;
      this.props.getBasicUserDetails();
      this.props.getProfileEditScreens();
      if (
        localStorage.getItem("specializationsApiData") === "undefined" ||
        localStorage.getItem("specializationsApiData") === null
      ) {
        let url = Urlconfig.getspecializationData;
        url = getUrl(url);
        services.get(url).then(res => {
          if (res && res.data) {
            localStorage.setItem(
              "specializationsApiData",
              JSON.stringify(res.data)
            );
          }
        });
      }
      if (this.props.editPreferences) {
        this.onClickEdit("6")();
      }
    });
    promise.catch(() => {
      this.setState({
        redirectToNoProfilePage: true
      });
    });
  };

  onClickEdit = idIndex => () => {
    tracker().on("event", { hitName: "profile$edit_icon_clicked$edit" });
    if (!this.props.profileEditScreens) {
      return false;
    }
    const { defaultFlow } = this.props.profileEditScreens;
    const id = defaultFlow[idIndex];
    const promise = new Promise((resolve, reject) => {
      this.props.updateCurrentScreenWithPromise(id, resolve, reject);
    });
    promise.then(() => {
      this.props.history.push(routeConfig.profileEdit.replace(":id", id), {
        isEdit: true,
        isUpdatePrefs: this.props.editPreferences
      });
    });
  };

  getMultiSelectData = field => {
    const data = [];
    field.length &&
      field.forEach(row => {
        data.push(row.name);
      });
    return data.join(", ");
  };

  handleCVDownload = () => {
    window.open(this.props.userProfile.cvPath);
  };

  handleSettingClick = () => {
    tracker().on("event", { hitName: "profile$settings_page_clicked$header" });
  };

  editButton = (index, text, id) => {
    return (
      <Button
        type="link hasHover"
        onClick={this.onClickEdit(index)}
        className="profile__editTextButton"
        id={id}
      >
        {text}
      </Button>
    );
  };

  getCommonTemplate = (heading, index) => {
    return (
      <div className="spreadHr">
        {heading && <p className="profile__subHeading">{heading}</p>}
        <Button
          type="link hasHover"
          onClick={this.onClickEdit(index)}
          className="profile__editButton"
          id={`${heading}EditButton`}
        >
          Edit
        </Button>
      </div>
    );
  };

  getPreferencesCard = userProfile => {
    if (!userProfile.preferences) {
      return (
        <div className="flatCard margin_10">
          <p className="profile__nopreferences">
            Your preferences for next job
          </p>
          {this.editButton(
            6,
            "Add preferences to view more relevant jobs",
            "PreferencesEditButton"
          )}
        </div>
      );
    }
    const {
      expectedCTC,
      locations,
      benefits,
      companyTypes,
      roleTypes
    } = userProfile.preferences;

    const preferenceslist = [
      "expectedCTC",
      "locations",
      "benefits",
      "companyTypes",
      "roleTypes"
    ];
    let missingPreferences = 0;
    preferenceslist.forEach(pref => {
      if (
        pref === "expectedCTC" &&
        (!userProfile.preferences[pref] || userProfile.preferences[pref] < 0)
      ) {
        missingPreferences += 1;
      } else if (
        pref !== "expectedCTC" &&
        (!userProfile.preferences[pref] ||
          !userProfile.preferences[pref].length)
      ) {
        missingPreferences += 1;
      }
    });

    return missingPreferences !== 5 ? (
      <div className="flatCard margin_10">
        <p className="profile__preferences">Your preferences for next job</p>
        {this.getCommonTemplate(null, 6)}
        {typeof(expectedCTC) !== "undefined" && expectedCTC != -1 && (
          <div>
            <p className="profile__subHeading" name="profileViewExp">
              Annual salary min. expectation
            </p>
            <PageHeading
              title={`${expectedCTC} LPA`}
              el="h2"
              name="profileViewDegree"
              className="profile__prefSubHeading marginBottom_20"
            />
          </div>
        )}
        {locations && locations.length > 0 && (
          <div>
            <p className="profile__subHeading" name="profileViewExp">
              Locations
            </p>
            <PageHeading
              title={this.getMultiSelectData(locations)}
              el="h2"
              name="profileViewDegree"
              className="profile__prefSubHeading marginBottom_20"
            />
          </div>
        )}
        {companyTypes.length > 0 && (
          <div>
            <p className="profile__subHeading" name="profileViewExp">
              Company Types
            </p>
            <PageHeading
              title={this.getMultiSelectData(companyTypes)}
              el="h2"
              name="profileViewDegree"
              className="profile__companyDetails marginBottom_20"
            />
          </div>
        )}
        {roleTypes.length > 0 && (
          <div>
            <p className="profile__subHeading" name="profileViewExp">
              Role Expectations
            </p>
            <PageHeading
              title={this.getMultiSelectData(roleTypes)}
              el="h2"
              name="profileViewDegree"
              className="profile__companyDetails marginBottom_20"
            />
          </div>
        )}
        {benefits.length > 0 && (
          <div>
            <p className="profile__subHeading" name="profileViewExp">
              Additional Benefits
            </p>
            <PageHeading
              title={this.getMultiSelectData(benefits)}
              el="h2"
              name="profileViewDegree"
              className="profile__companyDetails marginBottom_20"
            />
          </div>
        )}
        {missingPreferences > 0 && (
          <div className="marginTop_20 profile__missingPref">
            <Button
              type="link hasHover"
              onClick={this.onClickEdit(6)}
            >{`+${missingPreferences} more ${
              missingPreferences > 1 ? "preferences" : "preference"
            } `}</Button>
            <span className="color_mid_night">
              &nbsp;you may want to update
            </span>
          </div>
        )}
      </div>
    ) : (
      <div className="flatCard margin_10">
        <p className="profile__nopreferences">Your preferences for next job</p>
        {this.editButton(
          6,
          "Add preferences to view more relevant jobs",
          "PreferencesEditButton"
        )}
      </div>
    );
  };

  getAreaOfWorkCard = (userProfile, expTitleYear, expTitleMonth) => {
    return (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Area of work", 0)}
        <PageHeading
          title={userProfile.domain ? userProfile.domain.name : ""}
          el="h2"
          className="profile__value"
          name="profileViewPositionName"
        />
        <p className="profile__subHeading" name="profileViewExp">
          Experience
        </p>
        <PageHeading
          title={`${expTitleYear}${expTitleMonth}`}
          el="h2"
          name="profileViewExpYearMonth"
          className="profile__value"
        />
        <p className="profile__subHeading">Job Role</p>
        <PageHeading
          title={
            userProfile.specialization ? userProfile.specialization.name : ""
          }
          el="h2"
          name="profileViewJobRole"
          className="profile__lastvalue"
        />
      </div>
    );
  };

  getExpString = (year, month) => {
    let expString;
    if (!year) {
      expString = "0";
    } else if (year > 10) {
      expString = "10+ ";
    } else if (year) {
      expString = `${year}`;
    }
    if (month && month > 5) {
      expString = `${expString}.5`;
    }
    return expString === "1" ? `${expString}yr` : `${expString}yrs`;
  };

  getSkillsCard = userProfile => {
    return (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Skills and experience", 1)}
        {userProfile.skills &&
          userProfile.skills.map((skill, index) => (
            <div key={index}>
              <div
                className={`spreadHr profile__skillsValue ${
                  index + 1 < userProfile.skills.length ? "border_bottom" : ""
                }`}
              >
                <p name={`profileViewSkill${index + 1}`}>{skill.name}</p>
                <p name={`profileViewSkillExp${index + 1}`}>
                  {this.getExpString(
                    skill.experienceYear,
                    skill.experienceMonth
                  )}
                </p>
              </div>
            </div>
          ))}
      </div>
    );
  };

  getCvDetailsCard = userProfile => {
    return (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Attached CV", 2)}
        <PageHeading
          onClick={userProfile.cvPath ? this.handleCVDownload : undefined}
          title={userProfile.fileName || "No CV uploaded"}
          el="h2"
          name="profileViewCVName"
          className={`profile__lastvalue color_sky_blue ${
            userProfile.cvPath ? "cursor_pointer" : ""
          }`}
        />
      </div>
    );
  };

  getCompanyDetailsCard = params => {
    const {
      jobTitle,
      company,
      location,
      ctc,
      isCTCConfidential,
      noticePeriod
    } = params;
    return (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Company Details", 3)}
        <PageHeading
          title={jobTitle && jobTitle.name}
          el="h2"
          name="profileViewJobTitle"
          className="profile__companyDetails"
        />
        <PageHeading
          title={company.name}
          el="h2"
          name="profileViewCompanyName"
          className="profile__companyDetails trancate_singleLine"
        />
        <CompanyDetailsItem
          icon="ProfileLocation"
          name="profileViewLocation"
          text={location && location.name}
          className="fontSize_15"
        />
        <CompanyDetailsItem
          icon="ProfileJob"
          name="profileViewCtc"
          text={`${ctc} LPA ${isCTCConfidential ? "(Confidential)" : ""}`}
          className="fontSize_15"
          viewBox="0 0 16 16"
        />
        {noticePeriod[0] && (
          <CompanyDetailsItem
            icon="ProfileClock"
            name="profileViewNoticePeriod"
            text={`${noticePeriod[0].name} Notice Period`}
            iconSize={16}
            viewBox="0 0 18 18"
            className="fontSize_15"
          />
        )}
      </div>
    );
  };

  getEducationDetailsCard = params => {
    const {
      userProfile,
      course,
      college,
      courseDepartment,
      yearOfPassing
    } = params;
    return userProfile.latestEducationDetails ? (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Education Details", 4)}
        <PageHeading
          title={course && course.name}
          el="h2"
          name="profileViewDegree"
          className="profile__companyDetails"
        />
        <PageHeading
          title={college && college.name}
          el="h2"
          name="profileViewCollege"
          className="profile__companyDetails trancate_singleLine"
        />
        <p className="marginTop_4 fontSize_15" name="profileViewSpecialization">
          {courseDepartment && courseDepartment.name}
        </p>
        <CompanyDetailsItem
          icon="Graduate"
          name="profileViewGraduationYear"
          iconSize={18}
          text={` ${yearOfPassing} Graduate`}
          className="fontSize_15 profile__graduation"
          viewBox="0 0 14 14"
        />
      </div>
    ) : (
      <div className="flatCard margin_10">
        <p className="profile__subHeading">Education Details</p>
        {this.editButton(
          4,
          "Add education details",
          "educationDetailsEditButton"
        )}
      </div>
    );
  };

  getJobSearchAndProfilePrivacyCard = (preferences, jobSearchStatusDesc) => {
    return preferences && jobSearchStatusDesc ? (
      <div className="flatCard margin_10">
        {this.getCommonTemplate("Profile Privacy", 5)}
        <PageHeading
          title={
            (preferences && preferences.profilePrivacyDescription) ||
            "Profile Privacy is not selected"
          }
          name="profileViewPrivacy"
          el="h2"
          className="profile__companyDetails"
        />
        <p className="profile__subHeading marginTop_20">Stage of job search</p>
        <PageHeading
          title={jobSearchStatusDesc || "Job search status is not selected"}
          name="jobSearchStatus"
          el="h2"
          className="profile__companyDetails"
        />
      </div>
    ) : (
      <div className="flatCard margin_10">
        <p className="profile__subHeading">
          Stage of job search & profile privacy
        </p>
        {this.editButton(5, "Click to add", "profilePrivacyEditButton")}
      </div>
    );
  };

  render() {
    const { userProfile, basicUserDetails } = this.props;

    let noticePeriod = "";
    if (
      !userProfile ||
      !userProfile.domain ||
      !userProfile.latestCompanyDetails ||
      !this.state.noticePeriod
    ) {
      return <Loading />;
    }
    if (this.state.noticePeriod) {
      noticePeriod = this.state.noticePeriod.filter(np => {
        if (
          np.id === this.props.userProfile.latestCompanyDetails.noticePeriodId
        ) {
          return np;
        }
        return false;
      });
    }

    const { college, course, courseDepartment, yearOfPassing } =
      userProfile.latestEducationDetails || {};
    const { preferences, jobSearchStatusDesc } = userProfile;

    const {
      company,
      jobTitle,
      location,
      ctc,
      isCTCConfidential
    } = userProfile.latestCompanyDetails;
    const { redirectToNoProfilePage } = this.state;
    const expTitleYear = userProfile.experienceYear
      ? userProfile.experienceYear === 1
        ? `${userProfile.experienceYear}year `
        : `${userProfile.experienceYear}years `
      : "0Years ";
    const expTitleMonth = userProfile.experienceMonth
      ? userProfile.experienceMonth === 1
        ? `${userProfile.experienceMonth}month`
        : `${userProfile.experienceMonth}months`
      : "0months";

    return basicUserDetails &&
      Object.keys(basicUserDetails).length &&
      (userProfile && Object.keys(userProfile).length) ? (
      <div className="profile">
        <LogoHeader className="profile__logoHeader">
          <div className="profile__navBar">
            <Button
              to={routeConfig.profileSetting}
              className="color_dusk"
              onClick={this.handleSettingClick}
              id="goToSettingPage"
              type="link hasHover"
            >
              <Link to={routeConfig.profileSetting}>
                <SettingsIcon size={24} />
              </Link>
            </Button>
          </div>
        </LogoHeader>

        <div className="profile__heading">
          <PageHeading
            title={basicUserDetails.name}
            className="wrap-word"
            name="profileViewUserName"
          />
          <p className="fontSize_13" name="profileViewEmail">
            {basicUserDetails.email}
          </p>
          <p className="fontSize_13" name="profileViewPhoneNumber">
            {basicUserDetails.phoneNumber}
          </p>
        </div>
        {this.getPreferencesCard(userProfile)}
        {this.getAreaOfWorkCard(userProfile, expTitleYear, expTitleMonth)}
        {this.getSkillsCard(userProfile)}
        {this.getCvDetailsCard(userProfile)}
        {this.getCompanyDetailsCard({
          jobTitle,
          company,
          location,
          ctc,
          isCTCConfidential,
          noticePeriod
        })}
        {this.getEducationDetailsCard({
          userProfile,
          course,
          college,
          courseDepartment,
          yearOfPassing
        })}
        {this.getJobSearchAndProfilePrivacyCard(
          preferences,
          jobSearchStatusDesc
        )}
      </div>
    ) : redirectToNoProfilePage ? (
      <NoProfile getApiData={this.getApiData} />
    ) : (
      <Loading />
    );
  }
}
