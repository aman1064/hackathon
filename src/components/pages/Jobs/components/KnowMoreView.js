import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";
import BackButton from "../../../molecules/BackButton";
import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import Loading from "../../../atoms/Loading";
import PageHeading from "../../../atoms/PageHeading";
import HelpText from "../../../atoms/HelpText";
import { getUrl } from "../../../../utils/getUrl";
import UrlConfig from "../../../../constants/Urlconfig";
import showOptIn from "../../../../utils/showOptIn";
import { getCookie } from "../../../../utils/Cookie";
import parseJwt from "../../../../utils/isAgent";

import {
  trackCleverTap,
  trackCT,
  filterJobDetailsForCleverTap
} from "../../../../utils/tracking";
import JobDetails from "../../../templates/JobDetails/JobDetails";
import JDCompanyDetails from "../../../templates/JDCompanyDetails/JDCompanyDetails";
import getSessionStorage from "../../../../utils/getSessionStorage";
import ShareLink from "../../../templates/ShareLink/ShareLink";
import PageNotFound from "../../../templates/PageNotFound/PageNotFound";
import tracker from "../../../../analytics/tracker";
import {
  BookmarkUnselectedIcon,
  BookmarkSelectedIcon,
  CovidIcon,
  ThumbUpIcon
} from "../../../atoms/Icon/icons";
import Title from "../../../../ui-components/Modal/Title";
import Modal from "../../../../ui-components/Modal";
import RemoveJobModal from "./RemoveJobModal";
import services from "../../../../utils/services";

class KnowMoreView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const {
      jobDetails,
      location,
      accessToken,
      isUserProfileCompleted,
      isConsentFlow,
      history,
      getUserBasicDetails
    } = this.props;
    const { jobId, prevRoute } = queryString.parse(location.search);
    let jobDetailsUrl;
    if (accessToken && isUserProfileCompleted) {
      jobDetailsUrl = getUrl(UrlConfig.jobDetails.replace("{jobId}", jobId));
    } else {
      jobDetailsUrl = UrlConfig.getQuickJobDetails.replace("{jobId}", jobId);
    }
    if (!jobDetails || jobId) {
      this.props.setJobId(jobId);
      new Promise((resolve, reject) => {
        this.props.getJobDetails(resolve, reject, jobDetailsUrl);
      })
        .then(res => {
          if (res.processed) {
            history.push(
              `${
                routeConfig.errorPage
              }?message=Your%20response%20has%20been%20already%20recorded`
            );
          }
          window.__bgperformance.pageMeasure();
          tracker().on("ctapPageView", {
            hitName: "pv_detailed_jd",
            payload: {
              page_name: "js_detailed_jd",
              ...filterJobDetailsForCleverTap(res),
              from_page: this.getJobStatus()
            }
          });
        })
        .then(() => {
          window.__bgperformance.pageMeasure();
        })
        .catch(() => {
          window.__bgperformance.pageMeasure();

          this.setState({
            invalidJob: true
          });
        });
    }
    this.isQuickApplyFlow = getSessionStorage("isQuickApplyFlow");
    // check for whatsapp opt in
    if (accessToken && !this.isQuickApplyFlow) {
      getUserBasicDetails(UrlConfig.getUserBasicDetails);
    }
    sessionStorage.removeItem("isUserRegistered");

    this.ispublicJD = getSessionStorage("publicJobDetails");
    this.isApplyWithCv = location.state && location.state.isApplyWithCv;
    this.isFreshKnowMore =
      !this.isQuickApplyFlow && !this.ispublicJD && !this.isApplyWithCv;

    if (this.isFreshKnowMore) {
      tracker().on("event", {
        hitName: `browse$detailed_jd_viewed$detailed_jd`
      });
    }
    if (this.isApplyWithCv && !jobDetails.appliedDate) {
      if (this.ispublicJD) {
        this.handleApplyWithForceRecommend();
      } else {
        this.initPostApplyJob();
      }
    }
    window.addEventListener("scroll", this.handleJDScroll);

    window.onpopstate = () => {
      if (this.isQuickApplyFlow) {
        history.goForward();
      }
      if (prevRoute === "otp") {
        history.push({
          pathname: routeConfig.jobs,
          search: ""
        });
      }
    };
    this.setKnowmoreLandingRoute();
    if (isConsentFlow) {
      this.validateConsentUser();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleJDScroll);
    const isQuickApplyFlow = JSON.parse(
      sessionStorage.getItem("isQuickApplyFlow")
    );
    if (isQuickApplyFlow) {
      sessionStorage.removeItem("isQuickApplyFlow");
    }
    localStorage.removeItem("knowmoreLandingRoute");
  }

  setKnowmoreLandingRoute = () => {
    const { location } = this.props;
    let _landingRoute = location.state && location.state.redirectTo;
    if (_landingRoute) {
      localStorage.setItem("knowmoreLandingRoute", _landingRoute);
    } else {
      _landingRoute = localStorage.getItem("knowmoreLandingRoute");
    }
    this.knowmoreLandingRoute = _landingRoute;
  };

  getJobStatus() {
    const REDIRECT_TO = this.knowmoreLandingRoute;
    let fromPage;

    switch (REDIRECT_TO) {
      case routeConfig.applied:
        fromPage = "applied_jobs";
        break;
      case routeConfig.viewedJobs:
        fromPage = "viewed_jobs";
        break;
      case routeConfig.savedJobs:
        fromPage = "bookmarked_jobs";
        break;
      case routeConfig.jobs:
      default:
        fromPage = "new_jobs";
    }
    return fromPage;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const addToState = {};
    const bookmarkedFromAPI =
      nextProps.jobDetails && nextProps.jobDetails.bookmarkedDate;

    if (typeof prevState.isBookmarked === "boolean") {
      addToState.isBookmarked = prevState.isBookmarked;
    } else {
      addToState.isBookmarked = bookmarkedFromAPI;
    }
    return addToState;
  }

  cancelRemoveJob = () => {
    tracker().on("event", {
      hitName: `browse$not_relevant_cancel_clicked$detailed_jd$${
        this.state.jobIdToRemove
      }`
    });
    this.setState({ showRemoveJobModal: false });
  };

  closeRemoveJobModal = () => {
    tracker().on("event", {
      hitName: `browse$not_relevant_cross_clicked$detailed_jd`
    });
    this.setState({ showRemoveJobModal: false });
  };

  closeApplyWithCVModal = () => {
    this.setState({ showApplyWithCVModal: false });
  };

  openApplyWithCVModal = () => {
    this.setState({ showApplyWithCVModal: true });
  };

  handleApplyWithCVClick = () => {
    import("../../../../assets/json/cvUploadScreen.json").then(res => {
      const promise = new Promise((resolve, reject) => {
        this.props.updateCurrentScreenWithPromise(res.default, resolve, reject);
      });

      promise.then(() => {
        this.props.history.push(routeConfig.applyWithCV, {
          isEdit: true,
          isApplyWithCv: true,
          jobId: this.props.jobDetails.jobId,
          redirectTo: this.knowmoreLandingRoute
        });
      });
    });
  };

  handleApplyClick = () => {
    const { jobDetails, cvInProfile} = this.props;
    tracker().on("event", {
      hitName: `browse$apply_clicked$detailed_jd$${jobDetails.jobId}`
    });
    trackCleverTap("AppliedAttempted_DetailedJD", jobDetails);
    trackCT(
      "ApplyAttempted_DetailedJD",
      filterJobDetailsForCleverTap(jobDetails)
    );
    if (!cvInProfile) {
      this.openApplyWithCVModal();
    } else {
      this.initPostApplyJob();
    }
  };

  handleRemoveJobClick = () => {
    const { jobDetails } = this.props;
    tracker().on("event", {
      hitName: `browse$not_relevant_clicked$detailed_jd$${jobDetails.jobId}`
    });
    this.setState({
      showRemoveJobModal: true,
      jobIdToRemove: this.props.jobDetails.jobId
    });
  };

  handleSubmitRemoveJob = (removeJobUrl, selectedReasonsObj) => {
    tracker().on("event", {
      hitName: `browse$not_relevant_continue_clicked$detailed_jd$${
        this.state.jobIdToRemove
      }`
    });
    tracker().on("ctapEvent", {
      hitName: "detailed_jd_not_relevant_submit",
      payload: {
        ...filterJobDetailsForCleverTap(this.props.jobDetails),
        reason: selectedReasonsObj,
        page_name: "js_detailed_jd"
      }
    });
    const promise = new Promise((resolve, reject) => {
      this.props.removeJob(
        {
          jobId: this.state.jobIdToRemove,
          pageName: "jobs"
        },
        removeJobUrl,
        selectedReasonsObj,
        resolve,
        reject
      );
    });

    promise.then(res => {
      this.setState({ hideCTA: true });
      if (this.props.isConsentFlow) {
        this.props.openGlobalPrompt(
          `Thank you for sharing your preferences`,
          ""
        );
        this.props.history.push(routeConfig.jobs);
      } else {
        this.props.openGlobalPrompt(`${res}`, "");
      }
    });
    promise.catch(err => {
      this.props.openGlobalPrompt(`${err}`, "error");
    });
    if (this.props.location.state && this.props.location.state.redirectTo) {
      this.props.history.push(this.props.location.state.redirectTo);
    } else {
      this.props.history.push(routeConfig.jobs);
    }
  };

  handleJDScroll = () => {
    if (window.scrollY > 120 && !this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: true });
    } else if (window.scrollY <= 120 && this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: false });
    }

    if (window.scrollY > 226 && !this.state.isHeaderBordered) {
      this.setState({ isHeaderBordered: true });
    } else if (window.scrollY <= 226 && this.state.isHeaderBordered) {
      this.setState({ isHeaderBordered: false });
    }
  };

  handleApplyWithForceRecommend = () => {
    new Promise((resolve, reject) => {
      this.props.handlepublicJDApply(resolve, reject, true);
    }).then(res => {
      this.props.jobDetails.appliedDate = res.data;
      this.setState({ hideCTA: true });
      if (res.status === 200) {
        this.props.openGlobalPrompt(
          "Application sent to recruiter successfully",
          "success"
        );
      }
    });
  };

  validateConsentUser = () => {
    const { history, accessToken, userLogout } = this.props;
    const { id, prevRoute } = queryString.parse(window.location.search);
    const url = `${UrlConfig.userVerify}?id=${id}`;
    if (accessToken && id) {
      services.post(url).then(res => {
        if (!res.data) {
          if (prevRoute === "otp") {
            history.push(routeConfig.jobs);
          } else {
            userLogout();
          }
        }
      });
    }
  };

  handleBookmarkClick = () => {
    const { jobId } = this.props.jobDetails;
    tracker().on("event", {
      hitName: `browse$bookmark_clicked$detailed_jd$${jobId}`
    });
    trackCleverTap("Bookmarked_DetailedJD", this.props.jobDetails);
    const bookmarkUrl = getUrl(
      UrlConfig.recommendAndBookmark.replace("{jobId}", jobId)
    );
    this.props.setBookmark(bookmarkUrl, jobId, "knowMore");
    this.setState({ isBookmarked: true });
  };

  handleRemoveBookmarkClick = () => {
    const { jobId } = this.props.jobDetails;
    tracker().on("event", {
      hitName: `browse$unbookmark_clicked$detailed_jd$${jobId}`
    });
    trackCleverTap("Unbookmarked_DetailedJD", this.props.jobDetails);
    const deleteBookmarkUrl = getUrl(
      UrlConfig.unBookmarkJob.replace("{jobId}", jobId)
    );
    this.props.deleteBookmark(deleteBookmarkUrl, jobId, "knowMore");
    this.setState({ isBookmarked: false });
  };

  handleBackButtonClick = () => {
    const { prevRoute } = queryString.parse(window.location.search);
    if (prevRoute === "otp") {
      this.props.history.push({
        pathname: routeConfig.jobs,
        search: ""
      });
    }
    const { jobDetails } = this.props;
    const jobId = jobDetails && jobDetails.jobId;
    if (this.isFreshKnowMore) {
      tracker().on("event", {
        hitName: `browse$back_button_clicked$detailed_jd$${jobId}`
      });
    }
    this.props.history.goBack();
  };

  handleInterestedClick = () => {
    const { rcvId } = queryString.parse(window.location.search);
    const { openGlobalPrompt, history } = this.props;
    const url = getUrl(UrlConfig.postMarkInterested).replace("{rcvId}", rcvId);
    services.post(url).then(() => {
      openGlobalPrompt("Application sent to recruiter successfully", "success");
      history.push(routeConfig.jobs);
    });
  };

  initPostApplyJob() {
    this.setState({ hideCTA: true });
    const {
      jobDetails: { jobId },
      whatsappSubscription
    } = this.props;
    const isAgentProcess = parseJwt();
    // eslint-disable-next-line camelcase
    const from_page = `${this.getJobStatus()}`;
    const promise = new Promise((resolve, reject) => {
      this.props.postApplyJob(
        this.props.jobDetails.relevanceScore,
        resolve,
        reject,
        jobId
      );
    });
    promise
      .then(res => {
        this.props.jobDetails.appliedDate = res.data;
        if (res.status === 200) {
          tracker().on("ctapEvent", {
            hitName: "apply_success",
            payload: {
              // eslint-disable-next-line camelcase
              from_page: `${from_page}`,
              ...filterJobDetailsForCleverTap(this.props.jobDetails)
            }
          });
          tracker().on("ctapProfile", {
            hitName: "apply_success",
            payload: {
              does_cv_exist: true,
              is_profile_complete: true
            }
          });
          tracker().on("event", {
            hitName: `browse$apply_success$detailed_jd$${jobId}`
          });

          const showOptInModal =
            !isAgentProcess &&
            !whatsappSubscription &&
            showOptIn(
              getCookie("lastRejectTime") || 0,
              getCookie("rejectCount") || 0
            );
          if (showOptInModal) {
            this.props.showWhatsappOptIn(true, true);
          } else {
            this.props.openGlobalPrompt(
              "Application sent to recruiter successfully",
              "success"
            );
          }
          if (this.knowmoreLandingRoute) {
            this.props.history.push(this.knowmoreLandingRoute);
          } else {
            this.props.history.push(routeConfig.jobs);
          }
        }
      })
      .catch(() => {
        tracker().on("event", {
          hitName: `browse$apply_fail$detailed_jd$${jobId}`
        });
      });
  }

  render() {
    const {
      jobDetails,
      aboutCompany,
      renderBack = true,
      isConsentFlow
    } = this.props;
    const { isBookmarked } = this.state;
    const { jobId } = queryString.parse(window.location.search);

    let showShimmer = true;
    if ((jobDetails && jobId === jobDetails.jobId) || this.state.invalidJob) {
      showShimmer = false;
    }
    const isQuickApplyFlow = JSON.parse(
      sessionStorage.getItem("isQuickApplyFlow")
    );
    const isJobExpired =
      jobDetails &&
      jobDetails.status &&
      (jobDetails.status.toLowerCase() === "close" ||
        jobDetails.status.toLowerCase() === "closed");
    const isHideJob =
      jobDetails &&
      ["REJECT", "REJECTED", "APPROVAL_PENDING"].indexOf(jobDetails.status) >
        -1;
    const hiringStatus = jobDetails && jobDetails.hiringStatus;

    if (isHideJob && !jobDetails.appliedDate && !showShimmer) {
      return <PageNotFound type="hideJD" />;
    }
    if (this.state.invalidJob && !showShimmer) {
      return <PageNotFound />;
    }

    return !showShimmer ? (
      <>
        <div
          className={`darkBG KnowMore__CompanyDetails ${
            renderBack ? "isNormalJD" : "isQAFlow"
          } ${isJobExpired ? "KnowMore__CompanyDetails--isExpired" : ""}
           ${this.state.isHeaderSticky ? "isHeaderSticky" : ""} ${
            this.state.isHeaderBordered ? "isHeaderBordered" : ""
          } ${hiringStatus && hiringStatus !== "NA" ? "hasHiringStatus" : ""}`}
        >
          {renderBack ? (
            <div className="KnowMore__fixedNav">
              <BackButton action={this.handleBackButtonClick} />
              <div className="KnowMore__ActionsWrapper">
                {!isJobExpired && (
                  <ShareLink
                    jobId={jobDetails.jobId}
                    jobTitle={jobDetails.designation}
                    className="KnowMore__Share"
                    trackerCategory="browse"
                  />
                )}
                {!jobDetails.appliedDate && (
                  <button
                    onClick={
                      isBookmarked
                        ? this.handleRemoveBookmarkClick
                        : this.handleBookmarkClick
                    }
                    className="bookmarkIcon"
                    type="submit"
                  >
                    {isBookmarked ? (
                      <BookmarkSelectedIcon size={21} />
                    ) : (
                      <BookmarkUnselectedIcon size={21} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="KnowMore__fixedNav KnowMore__fixedNav--QA">
              <div className="KnowMore__ActionsWrapper">
                {!isJobExpired && (
                  <ShareLink
                    jobId={jobDetails.jobId}
                    jobTitle={jobDetails.designation}
                    className="KnowMore__Share"
                    trackerCategory="QAF"
                  />
                )}
              </div>
            </div>
          )}
          <div className="headerStickyBG" />
          <JDCompanyDetails isKnowMore jobDetails={jobDetails} />
        </div>
        {hiringStatus === "ACTIVE" && (
          <div className="JDHiringStatus">
            <ThumbUpIcon size={16} />
            <span>
              Even during COVID-19 crisis; {jobDetails.companyName} is still
              actively screening job applications to keep candidates updated.
              Kudos!
            </span>
          </div>
        )}
        {hiringStatus === "PASSIVE" && (
          <div className="JDHiringStatus">
            <CovidIcon size={20} />
            <span>
              Response from recruiters might get delayed due to COVID-19 effect
            </span>
          </div>
        )}
        <JobDetails jobDetails={jobDetails} aboutCompany={aboutCompany} />
        <div className="paddingAgainstBottomNav">
          {isConsentFlow &&
            !isJobExpired &&
            !jobDetails.markNotInterestedDate &&
            !jobDetails.appliedDate && (
              <div className="fixButtonToBottom">
                <Button
                  appearance="secondary"
                  className="minWidth_136"
                  onClick={this.handleRemoveJobClick}
                >
                  Not Interested
                </Button>

                <Button
                  className="minWidth_136"
                  onClick={this.handleInterestedClick}
                >
                  Interested
                </Button>
              </div>
            )}
          {!isConsentFlow && !isJobExpired && !jobDetails.appliedDate && (
            <div
              className={`${
                this.state.hideCTA ? "isHidden" : "fixButtonToBottom"
              }`}
            >
              <Button
                appearance="secondary"
                className="minWidth_136"
                onClick={this.handleRemoveJobClick}
              >
                Not Relevant
              </Button>

              <Button className="minWidth_136" onClick={this.handleApplyClick}>
                <span id={isQuickApplyFlow ? "quick_jd_Apply" : "jd_Apply"}>
                  Apply
                </span>
              </Button>
            </div>
          )}
        </div>
        <RemoveJobModal
          cancelRemoveJob={this.cancelRemoveJob}
          closeModal={this.closeRemoveJobModal}
          submitRemoveJob={this.handleSubmitRemoveJob}
          jobId={this.props.jobDetails.jobId}
          open={this.state.showRemoveJobModal}
          isConsentFlow={isConsentFlow}
          slideUp
        />
        <Modal
          open={this.state.showApplyWithCVModal}
          onClose={this.closeApplyWithCVModal}
          className="Modal__Bottom applyWithCV"
        >
          <Title handleClose={this.closeApplyWithCVModal} />
          <div>
            <PageHeading el="h2" title="Upload Resume to apply" />
            <HelpText text="Resume is required while applying so that recruiters can shortlist you. " />
          </div>
          <div className="Modal__FlatAction">
            <Button
              type="link hasHover"
              appearance="secondary"
              onClick={this.closeApplyWithCVModal}
            >
              Cancel
            </Button>
            <Button type="link hasHover" onClick={this.handleApplyWithCVClick}>
              Apply with CV
            </Button>
          </div>
        </Modal>
      </>
    ) : (
      <Loading />
    );
  }
}

KnowMoreView.propTypes = {
  jobDetails: PropTypes.object,
  location: PropTypes.object,
  accessToken: PropTypes.string,
  isUserProfileCompleted: PropTypes.bool,
  isConsentFlow: PropTypes.bool,
  history: PropTypes.object,
  getUserBasicDetails: PropTypes.func,
  setJobId: PropTypes.func,
  getJobDetails: PropTypes.func,
  openGlobalPrompt: PropTypes.func,
  showWhatsappOptIn: PropTypes.func,
  handlepublicJDApply: PropTypes.func,
  userLogout: PropTypes.func,
  updateCurrentScreenWithPromise: PropTypes.func,
  cvInProfile: PropTypes.bool,
  deleteBookmark: PropTypes.func,
  removeJob: PropTypes.func,
  setBookmark: PropTypes.func,
  whatsappSubscription: PropTypes.bool,
  postApplyJob: PropTypes.func,
  aboutCompany: PropTypes.object,
  renderBack: PropTypes.bool
};
KnowMoreView.defaultProps = {
  jobDetails: {},
  location: {},
  accessToken: "",
  isUserProfileCompleted: false,
  isConsentFlow: false,
  history: {},
  getUserBasicDetails: () => {},
  setJobId: () => {},
  getJobDetails: () => {},
  openGlobalPrompt: () => {},
  showWhatsappOptIn: () => {},
  handlepublicJDApply: () => {},
  userLogout: () => {},
  updateCurrentScreenWithPromise: () => {},
  cvInProfile: false,
  deleteBookmark: () => {},
  removeJob: () => {},
  setBookmark: () => {},
  whatsappSubscription: false,
  postApplyJob: () => {},
  aboutCompany: {},
  renderBack: true
};

export default KnowMoreView;
