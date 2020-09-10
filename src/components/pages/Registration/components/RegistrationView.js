import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import queryString from "query-string";
import Loading from "../../../atoms/Loading";
import FormContainer from "../../../templates/Form";
import { validateForm } from "../../../templates/Form/Validate";
import routeConfig from "../../../../constants/routeConfig";
import { isStrContainsKey, pathOr } from "../../../../utils/pureFns";
import getValuesMappedWithFormattedName from "../../../templates/Form/getMappedProfile";
import PageHeading from "../../../atoms/PageHeading";
import Button from "../../../atoms/Button";
import LogoHeader from "../../../organisms/LogoHeader";
import getProcessData from "../../../../utils/getProcessData";
import parseJwt from "../../../../utils/isAgent";
import NoNextScreen from "./NoNextScreen";
import AddPhoneNo from "../components/AddPhoneNo";
import { trackCleverTap, getParsedSkillsObj } from "../../../../utils/tracking";
import appConstants from "../../../../constants/appConstants";
import tracker from "../../../../analytics/tracker";

import getSessionStorage from "../../../../utils/getSessionStorage";
import Store from "../../../../store/Store";

import "../Registration.scss";

const LASTPAGE = "wishlist";

const mapSTPOfFormContainer = (state, props) => {
  const isEdit =
    props.history.location.state && props.history.location.state.isEdit;
  let valuesToMapFrom = [];
  const isValid =
    props.config.isSkippable ||
    (state.forms[props.config.name] && state.forms[props.config.name].isValid);
  props.config &&
    props.config.formFields &&
    props.config.formFields.forEach(field => {
      if (field.name && field.name.split("$")[0] !== "null") {
        valuesToMapFrom.push(field.name.split("$")[0]);
      }

      return valuesToMapFrom;
    });
  valuesToMapFrom = [...new Set(valuesToMapFrom)];
  if (
    isStrContainsKey(props.config.description, "wishlist") ||
    isStrContainsKey(props.config.description, "profile privacy")
  ) {
    valuesToMapFrom = pathOr(
      {},
      ["commonData", "userDetails", "profile", "preferences"],
      state
    );
  } else if (isStrContainsKey(props.config.description, "company details")) {
    valuesToMapFrom = pathOr(
      {},
      ["commonData", "userDetails", "profile", "latestCompanyDetails"],
      state
    );
  } else if (isStrContainsKey(props.config.description, "education details")) {
    valuesToMapFrom = pathOr(
      {},
      ["commonData", "userDetails", "profile", "latestEducationDetails"],
      state
    );
  } else {
    valuesToMapFrom = pathOr(
      {},
      ["commonData", "userDetails", "profile"],
      state
    );
  }
  if (isEdit) {
    return {
      form: props.config.name,
      initialValues: getValuesMappedWithFormattedName(
        props.config.formFields,
        valuesToMapFrom
      ),
      enableReinitialize: true,
      isValid
    };
  } else {
    return {
      form: props.config.name,
      initialValues: getValuesMappedWithFormattedName(
        props.config.formFields,
        valuesToMapFrom
      ),
      isValid
    };
  }
};
let ConnectedFC = connect(mapSTPOfFormContainer)(FormContainer);

function errorHandler(err, formName) {
  Store.dispatch(
    handleFormValidState({
      form: formName,
      isValid: false,
      errorMsg: err
    })
  );
}
function getTypeBasedValue(type, val) {
  switch (type) {
    case "input_text":
      val = val === "" ? 0 : parseInt(val, 10);
      break;
    case "floatInput":
      val = parseFloat(val);
      break;
    case "float_text":
      val = parseFloat(val);
      break;
    case "formNameInput":
      val = val.trim();
      break;
    case "checkbox":
      val = !!val;
      break;
    default:
      break;
  }
  return val;
}
function updateFormContainer(suggestors) {
  const ConnectFC = connect(props => {
    let valuesToMapFrom;
    const currentScreenConfig = getProcessData(
        props.registrationData.currentScreen,
        suggestors
      ),
      profile = props.commonData.userDetails.profile;
    const isValid =
      currentScreenConfig.isSkippable ||
      (props.forms[currentScreenConfig.name] &&
        props.forms[currentScreenConfig.name].isValid);
    if (isStrContainsKey(currentScreenConfig.description, "company details")) {
      valuesToMapFrom = profile.latestCompanyDetails
        ? profile.latestCompanyDetails
        : {};
    } else if (
      isStrContainsKey(currentScreenConfig.description, "education details")
    ) {
      valuesToMapFrom = profile.latestEducationDetails
        ? profile.latestEducationDetails
        : {};
    } else if (
      isStrContainsKey(currentScreenConfig.description, "wishlist") ||
      isStrContainsKey(currentScreenConfig.description, "profile privacy")
    ) {
      valuesToMapFrom = profile.preferences ? profile.preferences : {};
    } else {
      valuesToMapFrom = profile ? profile : {};
    }

    return {
      form: currentScreenConfig.name,
      initialValues: getValuesMappedWithFormattedName(
        currentScreenConfig.formFields,
        valuesToMapFrom
      ),
      isValid
    };
  })(FormContainer);
  ConnectedFC = ConnectFC;
}
const getTrimValue = value => {
  if (typeof value === "string") {
    value = value && value.trim();
  }
  if (typeof value === "object") {
    value.name = value.name && value.name.trim();
  }
  return value;
};

const getCurrentScreenValues = (values, currentScreenConfig) => {
  const valuesKeys = Object.keys(values);
  const currentScreenValues = {};
  currentScreenConfig.formFields.forEach(({ name, childFields }) => {
    if (valuesKeys.includes(name)) {
      currentScreenValues[name] = getTrimValue(values[name]);
    } else if (childFields && childFields.length) {
      childFields.forEach(childField => {
        if (valuesKeys.includes(childField.name)) {
          currentScreenValues[childField.name] = getTrimValue(
            values[childField.name]
          );
        }
      });
    }
  });
  return currentScreenValues;
};

export default class RegistrationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToNoProfilePage: false
    };
    this.isPageLoadTracked = false;

    this.isEdit =
      (props.location.state && props.location.state.isEdit) ||
      props.location.pathname.includes("profile");
  }

  flatternObj = (obj, key, prefixToAdd) => {
    if (prefixToAdd) {
      for (const _key in obj[key]) {
        obj[key][`${prefixToAdd}_${_key}`] = obj[key][_key];
        delete obj[key][_key];
      }
    }
    Object.assign(obj, obj[key]);
    delete obj[key];
    return obj;
  };

  getParsedProfileObj = profileObj => {
    if (profileObj.hasOwnProperty("latestCompanyDetails")) {
      this.flatternObj(profileObj, "latestCompanyDetails");
    } else if (profileObj.hasOwnProperty("latestEducationDetails")) {
      this.flatternObj(profileObj, "latestEducationDetails");
    } else if (profileObj.hasOwnProperty("preferences")) {
      this.flatternObj(profileObj, "preferences", "wishlist");
    } else if (profileObj.hasOwnProperty("skills")) {
      getParsedSkillsObj(profileObj);
    }
    return profileObj;
  };

  handlePublicJDPageSubmitAndSkip = (res, publicJobDetails) => {
    if (res.fileName) {
      new Promise((resolve, reject) => {
        this.props.handlepublicJDApply(resolve, reject, true);
      }).then(res => {
        if (res.status === 200) {
          this.props.openGlobalPrompt(
            "Application sent to recruiter successfully",
            "success"
          );
        }
        this.props.history.push(`${routeConfig.jobs}?isBackNotAllowed=true`);
      });
    } else {
      this.props.history.push({
        pathname: routeConfig.jobs,
        search: `?jobId=${publicJobDetails.jobId}`
      });
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    const { currentScreenConfig, profile, location, forms } = this.props;
    let values =
      (forms[currentScreenConfig.name] &&
        forms[currentScreenConfig.name].values) ||
      {};

    if (values[currentScreenConfig.name] === "") {
      return false;
    }
    values = getCurrentScreenValues(values, currentScreenConfig);
    if (currentScreenConfig.pageName !== LASTPAGE) {
      this.isPageLoadTracked = false;
    }
    const isEdit =
        (location.state && location.state.isEdit) ||
        location.pathname.includes("profile"),
      isUpdatePrefs = location && location.state;
    const isCvExist = profile.fileName ? true : false;

    const isQuickApplyCVUpdate =
      location.state && location.state.isQuickApplyCVUpdate;

    const postObj = {
      currentScreenId: currentScreenConfig.name,
      userProfileId: this.props.profile.id,
      profile: {}
    };
    if (
      validateForm(
        currentScreenConfig.formFields,
        values,
        currentScreenConfig.name
      )
    ) {
      if (isStrContainsKey(currentScreenConfig.description, "upload")) {
        postObj.profile = {};
      } else {
        for (const key in values) {
          if (values.hasOwnProperty(key)) {
            const keyArray = key.split("$");
            if (
              keyArray[1] === "domainId" &&
              values[key] !== profile["domainId"]
            ) {
              this.props.handleChangeData({
                form: `${localStorage.getItem(
                  "profile$specializationId$modalSelect$formName"
                )}`,
                fieldName: "profile$specializationId$modalSelect",
                value: ""
              });

              this.props.updateUserProfile({
                specializationId: "",
                skills: [],
                domainId: values[key]
              });
            }
            if (keyArray[1] === "expectedCTC" && values[key] === "") {
              values[key] = -1;
            }
            if (keyArray[0] === "profile") {
              let val = values[key];
              val = getTypeBasedValue(keyArray[2], val);
              postObj.profile[keyArray[1]] = val;
            } else {
              let val = values[key];
              val = getTypeBasedValue(keyArray[2], val);
              if (val !== "") {
                if (postObj.profile.hasOwnProperty(keyArray[0])) {
                  postObj.profile[keyArray[0]][keyArray[1]] = val;
                } else {
                  postObj.profile[keyArray[0]] = {};
                  postObj.profile[keyArray[0]][keyArray[1]] = val;
                }
              }
            }
          }
        }
      }
      const myProfile = {};
      Object.keys(postObj.profile).map(val => {
        if (val === "isWorkingInManagementRole") {
          return (myProfile[val] = postObj.profile[val]);
        }
        if (
          val !== "null" &&
          val !== "fileName" &&
          val !== "5c752066892f192957a3f431" &&
          (postObj.profile[val] || postObj.profile[val] === 0)
        ) {
          return (myProfile[val] = postObj.profile[val]);
        } else {
          return null;
        }
      });
      postObj.profile = myProfile;

      this.props.updateUserProfile(myProfile);
      if (isQuickApplyCVUpdate) {
        this.props.history.push(routeConfig.quickApplyProfile);
      } else {
        const promise = new Promise((resolve, reject) => {
          this.props.getNextScreen(postObj, resolve, reject, isEdit);
        });
        promise.then(res => {
          const publicJobDetails = getSessionStorage("publicJobDetails");
          if (res && res.isUserProfileCompleted && publicJobDetails) {
            this.handlePublicJDPageSubmitAndSkip(res, publicJobDetails);
          } else if (isUpdatePrefs && isUpdatePrefs.isUpdatePrefs) {
            this.props.history.push(routeConfig.jobs);
          } else if (isQuickApplyCVUpdate) {
            this.props.history.push(routeConfig.quickApplyProfile);
          } else if (isEdit) {
            const cleverTapEvent = `${currentScreenConfig.pageName}_next_click`;
            // if (cleverTapEvent && cleverTapEvent.includes("cv_")) {
            //   cleverTapEvent += "_later";
            // }
            tracker().on("event", {
              hitName: `profile$update_clicked$${currentScreenConfig.pageName}`
            });
            tracker().on("ctapEvent", {
              hitName: cleverTapEvent,
              payload: {
                page_name: `js_${currentScreenConfig.pageName}`
              }
            });
            tracker().on("ctapProfile", {
              hitName: cleverTapEvent,
              payload: {
                ...this.getParsedProfileObj(postObj.profile),
                is_profile_complete: true,
                does_cv_exist: isCvExist
              }
            });

            this.props.history.push(routeConfig.profile);
          } else {
            const cleverTapEvent = `${currentScreenConfig.pageName}_next_click`;
            tracker().on("event", {
              hitName: `registration$next_button_clicked$${
                currentScreenConfig.pageName
              }`
            });

            tracker().on("ctapEvent", {
              hitName: cleverTapEvent,
              payload: {
                page_name: `js_${currentScreenConfig.pageName}`
              }
            });
            tracker().on("ctapProfile", {
              hitName: cleverTapEvent,
              payload: {
                ...this.getParsedProfileObj(postObj.profile),
                is_profile_complete:
                  res && res.isUserProfileCompleted ? true : false,
                does_cv_exist: res.fileName ? true : false
              }
            });
            if (res && res.isUserProfileCompleted) {
              this.props.history.push(
                `${routeConfig.jobs}?isBackNotAllowed=true`
              );
            } else if (res) {
              this.props.history.push(
                routeConfig.regWithId.replace(":id", res)
              );
            }
          }
        });
        return promise.catch(err => {
          if (err === "apifailure") {
            this.setState({
              redirectToNoProfilePage: true
            });
          } else {
            errorHandler(err, currentScreenConfig.name);
          }
        });
      }
    }
  };
  handleSkip = () => {
    const { currentScreenConfig, profile, suggestors } = this.props;
    const postObj = {
      currentScreenId: currentScreenConfig.name,
      userProfileId: profile.id,
      profile: {}
    };
    if (currentScreenConfig.pageName !== LASTPAGE) {
      this.isPageLoadTracked = false;
    }
    trackCleverTap(`reg_SkipClicked_${currentScreenConfig.pageName}`);
    const promise = new Promise((resolve, reject) => {
      this.props.getNextScreen(postObj, resolve, reject, false);
    });
    promise.then(res => {
      const publicJobDetails = getSessionStorage("publicJobDetails");
      if (res && res.isUserProfileCompleted && publicJobDetails) {
        this.handlePublicJDPageSubmitAndSkip(res, publicJobDetails);
      } else if (res && res.isUserProfileCompleted) {
        this.props.history.push(`${routeConfig.jobs}?isBackNotAllowed=true`);
      } else {
        res &&
          this.props.history.push(routeConfig.regWithId.replace(":id", res));
      }
      tracker().on("event", {
        hitName: `registration$skip_button_clicked$${
          currentScreenConfig.pageName
        }`
      });
      return updateFormContainer(suggestors);
    });
    return promise.catch(err => {
      errorHandler(err, currentScreenId);
    });
  };
  handleBackClick = () => {
    const { currentScreenConfig, suggestors } = this.props;
    this.startTime = performance.now();
    this.isPageLoadTracked = false;

    const isEdit =
        (this.props.location.state && this.props.location.state.isEdit) ||
        location.pathname.includes("profile"),
      isUpdatePrefs =
        this.props.location.state && this.props.location.state.isUpdatePrefs;
    if (isEdit) {
      trackCleverTap(`edit_BackClicked_${currentScreenConfig.pageName}`);
      tracker().on("event", {
        hitName: `profile$back_clicked$${currentScreenConfig.pageName}`
      });
    } else {
      trackCleverTap(`reg_BackClicked_${currentScreenConfig.pageName}`);
      tracker().on("event", {
        hitName: `registration$back_button_clicked$${
          currentScreenConfig.pageName
        }`
      });
    }

    if (isUpdatePrefs && isUpdatePrefs.isUpdatePrefs) {
      this.props.history.push(routeConfig.jobs);
    } else if (isEdit) {
      const { prevRoute } = queryString.parse(location.search);
      if (prevRoute === "otp") {
        this.props.history.push({
          pathname: routeConfig.profile,
          search: ""
        });
      } else {
        this.props.history.goBack();
      }
    } else {
      this.props.history.goBack();
      updateFormContainer(suggestors);
    }
  };
  isDifferentRoute() {
    const { location, currentScreenConfig } = this.props;
    const isEdit = location.state && location.state.isEdit,
      path = window.location.pathname.split("/");
    const noDomain =
      location && location.pathname && location.pathname.includes("noDomain")
        ? true
        : false;
    if (noDomain) {
      return true;
    }
    let pathVariable;
    if (currentScreenConfig) {
      pathVariable = currentScreenConfig.name;
      if (!appConstants.APLHANUMERIC_REGEX.test(path[2])) {
        pathVariable = currentScreenConfig.pageName;
      }
    }

    return (
      path[2] &&
      !isEdit &&
      currentScreenConfig &&
      path[2] !== pathVariable &&
      path[2] !== "addPhoneNumber"
    );
  }

  updateCurrentScreen = path => {
    const { suggestors } = this.props;
    // eslint-disable-next-line no-new
    new Promise((resolve, reject) => {
      this.props.updateCurrentScreenWithPromise(path[2], resolve, reject);
    });
    updateFormContainer(suggestors);
  };

  componentWillReceiveProps(nextProps) {
    if (window.location.pathname.includes("noDomain")) {
      this.props.history.push("/registration/noDomain");
    }
  }

  componentWillUnmount() {
    const { history, location, defaultFlow } = this.props;
    //Added profile in case of next button is clicked on /profile/{screen name}
    //did this for deferred linking in apps
    if (
      !history.location.pathname.includes("registration") &&
      !history.location.pathname.includes("profile") &&
      !location.pathname.includes(defaultFlow[defaultFlow.length - 1]) &&
      !this.isEdit &&
      !location.pathname.includes("addPhoneNumber")
    ) {
      this.props.history.push(location.pathname);
    } else if (!this.isEdit && !location.pathname.includes("addPhoneNumber")) {
      this.props.history.goForward();
    }

    if (this.isEdit) {
      const { currentScreenConfig } = this.props;
      let formName = currentScreenConfig.name;
      if (
        isStrContainsKey(
          currentScreenConfig.description,
          "domain and experience"
        )
      ) {
        formName = "domainAndExp";
      }
      this.props.reset(formName);
    }
  }

  componentWillUpdate() {
    const path = window.location.pathname.split("/");
    // if (
    //   this.props.currentScreenConfig &&
    //   path[2] !== this.props.currentScreenConfig.name
    // ) {
    //   this.props.history.push(routeConfig.errorPage);
    // }
    if (
      this.props.screens &&
      typeof this.props.screens[path[2]] !== "undefined"
    ) {
      if (this.isDifferentRoute()) {
        if (!path.includes("noDomain")) {
          this.updateCurrentScreen(path);
        } else {
          ConnectedFC = connect({
            form: "noDomain"
          })(FormContainer);
        }
        window.scrollTo(0, 0);

        if (
          this.props.currentScreenConfig &&
          this.props.currentScreenConfig.name
        ) {
          this.isPageLoadTracked = false;
        }
      }
    }
  }
  

  componentDidUpdate() {
    const { currentScreenConfig } = this.props;
    window.__bgperformance.pageMeasure();

    if (
      !this.isPageLoadTracked &&
      !this.isDifferentRoute() &&
      currentScreenConfig
    ) {
      this.isPageLoadTracked = true;

      if (currentScreenConfig.pageName === "domain_experience") {
        tracker().on("ctapPageView", {
          hitName: "pv_domain_experience",
          payload: {
            page_name: "js_domain_experience_fallback"
          }
        });
      } else if (currentScreenConfig.pageName === "wishlist") {
        tracker().on("ctapPageView", {
          hitName: "pv_wishlist",
          payload: {
            page_name: "js_wishlist"
          }
        });
      } else if (currentScreenConfig.pageName === "job_search_status") {
        tracker().on("ctapPageView", {
          hitName: "pv_profile_privacy",
          payload: {
            page_name: "js_profile_privacy"
          }
        });
      }
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    window.onpopstate = () => {
      if (window.location.pathname.includes("profile")) {
        this.props.history.push(routeConfig.profile);
      }
    };
    global.prevTrackedPage = "";
    this.isPageLoadTracked = false;
    const { currentScreenConfig, location, firstScreenId } = this.props,
      isEdit = location.state && location.state.isEdit;
    const path = window.location.pathname.split("/");
    if (path.includes("addPhoneNumber")) {
      return;
    }
    if (
      path[2] === firstScreenId &&
      isStrContainsKey(currentScreenConfig.description, "other domain")
    ) {
      this.updateCurrentScreen(path);
    }

    if (
      path[1] === "profile" &&
      !appConstants.APLHANUMERIC_REGEX.test(path[2])
    ) {
      new Promise((resolve, reject) => {
        this.props.getProfileEditScreens(null, resolve, reject);
      }).then(() => {
        this.props.updateCurrentScreenWithPromise(path[2]);
      });
    } else if (
      this.props.screens &&
      this.props.screens.length === 0 &&
      !isEdit
    ) {
      this.props.getRegistrationScreenData(this.props.profile);
    }
    this.getSuggestorsData();
  }

  handleRetry() {
    this.setState({ redirectToNoProfilePage: false });
  }

  getSuggestorsData() {
    const {
      getPrefetchSuggestors,
      suggestorLastUpdatedTime,
    } = this.props;
    getPrefetchSuggestors(new Date().getTime(), suggestorLastUpdatedTime);
  }

  render() {
    const {
        location,
        currentScreenConfig,
        isUserProfileCompleted,
        history,
        mobileNumberVerified,
        accessToken
      } = this.props,
      isEdit =
        (this.props.location.state && this.props.location.state.isEdit) ||
        location.pathname.includes("profile"),
      isAgent = parseJwt(accessToken),
      { redirectToNoProfilePage } = this.state;
    return isUserProfileCompleted &&
      mobileNumberVerified &&
      !isEdit &&
      location.pathname.includes(routeConfig.registration) ? (
      <Redirect to={routeConfig.jobs} />
    ) : redirectToNoProfilePage ? (
      <NoNextScreen getApiData={this.handleRetry.bind(this)} />
    ) : !mobileNumberVerified && !isEdit && !isAgent ? (
      <AddPhoneNo {...this.props} />
    ) : currentScreenConfig ? (
      <div className={`registrationPage ${isEdit ? "isEdit" : ""}`}>
        <div className="registrationPage__headerNav flexCenter marginBottom_36 spreadHr">
          <LogoHeader isSmallLogo className="padding_0" />
          {currentScreenConfig.isSkippable && !isEdit && (
            <Button
              onClick={this.handleSkip}
              id="regSkipButton"
              className="skipButton"
              type="link hasHover"
              appearance="secondary"
            >
              SKIP
            </Button>
          )}
        </div>
        {currentScreenConfig.pageHeading && (
          <PageHeading
            title={currentScreenConfig.pageHeading}
            className="marginBottom_36"
          />
        )}
        <ConnectedFC
          config={currentScreenConfig}
          form={currentScreenConfig.name}
          onSubmit={this.handleSubmit}
          handleBackClick={
            this.props.currentScreenConfig.name !== this.props.firstScreenId ||
            isEdit
              ? this.handleBackClick.bind(this)
              : ""
          }
          formId={currentScreenConfig.name}
          history={history}
          inspectletName={isEdit ? "editProfile" : "registerProfile"}
        />
      </div>
    ) : (
      <Loading />
    );
  }
}
