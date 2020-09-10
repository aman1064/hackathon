/* eslint-disable react/prop-types */
/* eslint-disable no-nested-ternary */
import React, { Component } from "react";
import PropTypes from "prop-types";
import queryString from "query-string";

import PageHeading from "../../../atoms/PageHeading";
import CompanyDetails from "../../../organisms/CompanyDetails";
import SwipeCards from "../../../templates/SwipeCards";
import List from "../../../molecules/List/List";
import routeConfig from "../../../../constants/routeConfig";
import FilterProps from "../../../atoms/FilterProps";
import { prependZero } from "../../../../utils/pureFns";
import { setCookie, getCookie } from "../../../../utils/Cookie";
import LastJobCard from "./LastJobCard";
import JobsViewActionWrapper from "./JobsViewActionWrapper";
import { getUrl } from "../../../../utils/getUrl";
import UrlConfig from "../../../../constants/Urlconfig";
import JobsViewBookmark from "./JobsViewBookmark";
import CovidMessageBar from "../../../organisms/CovidMessageBar";

import "../Jobs.scss";
import NoJobs from "./NoJobs";
import SampleJobCard from "./SampleJobCard";
import Loading from "../../../atoms/Loading";
import {
  trackCleverTap,
  filterJobDetailsForCleverTap
} from "../../../../utils/tracking";
import getTimeDiff from "../../../../utils/getTimeDiff";
import getSessionStorage from "../../../../utils/getSessionStorage";
import RadioGroupModal from "../../../templates/RadioGroupModal";
import getProfilePrivacyConfig from "../../../../utils/getProfilePrivacyConfig";
import getJobSearchStatusConfig from "../../../../utils/getJobSearchStatusConfig";
import tracker from "../../../../analytics/tracker";
import isMobileDevice from "../../../../utils/isMobileDevice";
import {
  appRedirectUrl,
  appRedirectUrlFromAPI
} from "../../../../configs/globalConfig";
import RemoveJobModal from "./RemoveJobModal";
// import LogoSmall from "../../../../assets/images/png/bigshyft_logo_small.png";
import LogoSmall from "../../../../assets/images/svg/logo_small_covid.svg";

class JobsView extends Component {
  constructor(props) {
    super(props);
    this.startTime = performance.now();
    this.isQuickApply = getSessionStorage("isQuickApply");
    this.state = {
      redirectToNoJobsPage: false,
      isProfileVisibility: true,
      isVisitJobSearchStatus: false,
      renderSampleJobCard: false,
      // iscovidMsgShown: false,
      showLoading: false
    };
  }

  componentDidMount() {
    const isQuickApplyFlow = getSessionStorage("isQuickApplyFlow");
    const isUserRegistered = sessionStorage.getItem("isUserRegistered");
    // const covidMsgCrossed = getCookie("covidMsgCrossed") || false;
    if (isQuickApplyFlow && isUserRegistered === "2") {
      this.setState({
        isProfileVisibility: getCookie("isProfileVisibility") || false
      });
    }
    // if (!covidMsgCrossed) {
    //   this.setState({ iscovidMsgShown: !covidMsgCrossed });
    // }
    sessionStorage.removeItem("isQuickApplyFlow");
    sessionStorage.removeItem("isUserRegistered");
    tracker().on("ctapPageView", {
      hitName: "pv_jobs_tab",
      payload: {
        page_name: "js_jobs_tab",
        total_job_count:
          this.props.recommendedJobs && this.props.recommendedJobs.totalElements
      }
    });

    const timeDiff = getTimeDiff(
      new Date(),
      new Date(sessionStorage.getItem("sessionStartTime"))
    );
    const isUpdated = getSessionStorage("isUpdated");
    const isFresh = getSessionStorage("isFresh");
    if (isFresh && timeDiff <= 30 && !isUpdated) {
      const jobs = getSessionStorage("jobs");
      if (jobs.length === 0) {
        this.setState({
          redirectToNoJobsPage: true
        });
      }

      window.__bgperformance.pageMeasure();
    } else {
      const promise = new Promise((resolve, reject) => {
        this.props.getRecommendedJobs(true, resolve, reject);
      });
      promise.then(res => {
        if (res.jobs.length === 0) {
          const viewedJobsPromise = new Promise((resolve, reject) => {
            this.props.getViewedJobs(
              `${getUrl(UrlConfig.viewedJobs)}?page=0&size=10`,
              false,
              resolve,
              reject
            );
          });
          viewedJobsPromise.then(resp => {
            if (
              resp.totalElements &&
              !sessionStorage.getItem("jobsNavClicked") &&
              !sessionStorage.getItem("hasRedirectToViewed")
            ) {
              sessionStorage.setItem("hasRedirectToViewed", true);
              this.props.history.push(routeConfig.viewedJobs);
            } else {
              this.setState({
                redirectToNoJobsPage: true
              });
            }
          });
        }

        if (
          !res.totalJobsAcrossAllCategories &&
          !this.state.renderSampleJobCard
        ) {
          this.setState({ renderSampleJobCard: true });
        }
        if (res.jobs.length) {
          this.props.setActiveSwipeJobIndex(0);
          const promise2 = new Promise(resolve => {
            this.props.setJobId(res.jobs[res.jobs.length - 1].jobId, resolve);
          });
          promise2.then(() => {
            if (!this.props.agentId) {
              this.props.postViewedJob(res.jobs[res.jobs.length - 1].jobId);
            }
          });
        }
        sessionStorage.setItem("isFresh", true);
        sessionStorage.setItem("sessionStartTime", new Date());
        sessionStorage.setItem("isUpdated", false);
        sessionStorage.setItem("jobs", JSON.stringify(res.jobs));
        sessionStorage.setItem("totalJobCount", res.totalElements);
        // to re render if there is any update in the number of jobs
        this.forceUpdate();
        window.__bgperformance.pageMeasure();
      });
      promise.catch(err => {
        if (err.status >= 300) {
          this.setState({
            redirectToNoJobsPage: true
          });
        }
      });
    }

    this._isMounted = true;

    window.onpopstate = () => {
      const { pathname } = window.location;
      if (
        this._isMounted &&
        (pathname === routeConfig.signup || pathname === routeConfig.login)
      ) {
        this.props.userLogout();
      }
      if (pathname.includes("otp")) {
        this.props.history.push(routeConfig.jobs);
      }
    };
    //    this.setState({ isMobileDevice: isMobileDevice() });

    if (
      Object.keys(this.props.recommendedJobs).length &&
      !this.props.recommendedJobs.totalJobsAcrossAllCategories
    ) {
      this.setState({ renderSampleJobCard: true });
    }
  }

  componentWillUnmount() {
    const { isBackNotAllowed } = queryString.parse(this.props.location.search);
    if (isBackNotAllowed) {
      this.props.history.goForward();
    }
  }

  static getDerivedStateFromProps = nextProps => {
    let addToState;
    if (nextProps.jobs && !nextProps.jobs.length) {
      sessionStorage.setItem("jobs", JSON.stringify([]));
      addToState = { redirectToNoJobsPage: true };
    } else {
      addToState = { redirectToNoJobsPage: false };
    }
    return addToState;
  };

  handleJobSearchStatusModalSubmit = selectedValue => {
    const postObj = {
      jobSearchStatus: selectedValue
    };
    new Promise((resolve, reject) => {
      this.props.postUpdateUserProfile(postObj, resolve, reject);
    }).then(() => {
      this.setState({ isVisitJobSearchStatus: true });
    });
  };

  handleProfilePrivacyModalSubmit = selectedValue => {
    tracker().on("event", {
      hitName: this.isQuickApply
        ? "QAF$continue_clicked$profile_privacy_apply"
        : "QAF$continue_clicked$profile_privacy_viewmore"
    });
    const postObj = {
      preferences: {
        profilePrivacy: selectedValue
      }
    };
    new Promise((resolve, reject) => {
      this.props.postUpdateUserProfile(postObj, resolve, reject);
    }).then(() => {
      this.setState({ isProfileVisibility: true });
      setCookie("isProfileVisibility", true);
      sessionStorage.removeItem("isQuickApplyFlow");
    });
  };

  handleRemoveJobClick = jobId => {
    const { activeSwipeJobIndex, jobs } = this.props;
    tracker().on("event", {
      hitName: `browse$not_relevant_clicked$card$${jobId}`
    });

    this.setState({ showRemoveJobModal: true, jobIdToRemove: jobId });

    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      trackCleverTap(
        "MandateNotRelevant_Browse",
        jobs[jobs.length - activeSwipeJobIndex - 1]
      );
    }
  };

  cancelRemoveJob = () => {
    const { activeSwipeJobIndex, jobs } = this.props;
    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      trackCleverTap(
        "MandateNotRelevantCancel_Browse",
        jobs[jobs.length - activeSwipeJobIndex - 1]
      );
    }

    tracker().on("event", {
      hitName: `browse$not_relevant_cancel_clicked$card$${
        this.state.jobIdToRemove
      }`
    });
    this.closeRemoveJobModal();
  };

  crossRemoveJobModal = () => {
    tracker().on("event", {
      hitName: `browse$not_relevant_cross_clicked$card$${
        this.state.jobIdToRemove
      }`
    });
    this.closeRemoveJobModal();
  };

  closeRemoveJobModal = () => {
    this.setState({ showRemoveJobModal: false });
  };

  handleKnowMoreClick = jobId => {
    const { activeSwipeJobIndex, jobs } = this.props;
    tracker().on("event", {
      hitName: `browse$know_more_clicked$card$${jobId}`
    });
    this.props.history.push({
      pathname: routeConfig.jobs,
      search: `?jobId=${jobId}`,
      state: { redirectTo: "/jobs" }
    });

    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      trackCleverTap(
        "MandateKnowMore_Browse",
        jobs[jobs.length - activeSwipeJobIndex - 1]
      );
    }
  };

  handleBookmarkClick = jobId => {
    const { activeSwipeJobIndex, jobs } = this.props;
    tracker().on("event", {
      hitName: `browse$bookmark_clicked$card$${jobId}`
    });
    const bookmarkUrl = getUrl(UrlConfig.bookmarkJob.replace("{jobId}", jobId));
    this.props.setBookmark(bookmarkUrl, jobId, "browse");
    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      trackCleverTap(
        "MandateBookmarked_Browse",
        jobs[jobs.length - activeSwipeJobIndex - 1]
      );
    }
  };

  handleRemoveBookmarkClick = jobId => {
    const { activeSwipeJobIndex, jobs } = this.props;
    tracker().on("event", {
      hitName: `browse$unbookmark_clicked$card$${jobId}`
    });
    const deleteBookmarkUrl = getUrl(
      UrlConfig.unBookmarkJob.replace("{jobId}", jobId)
    );
    this.props.deleteBookmark(deleteBookmarkUrl, jobId, "browse");
    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      trackCleverTap(
        "MandateUnookmarked_Browse",
        jobs[jobs.length - activeSwipeJobIndex - 1]
      );
    }
  };

  handleSubmitRemoveJob = (removeJobUrl, selectedReasonsObj) => {
    const { activeSwipeJobIndex, jobs, agentId, postViewedJob } = this.props;
    tracker().on("event", {
      hitName: `browse$not_relevant_continue_clicked$card$${
        this.state.jobIdToRemove
      }`
    });
    if (jobs && jobs[jobs.length - activeSwipeJobIndex - 1]) {
      tracker().on("ctapEvent", {
        hitName: "jobs_tab_not_relevant_submit",
        payload: {
          page_name: "js_jobs_tab",
          ...filterJobDetailsForCleverTap(
            jobs[jobs.length - activeSwipeJobIndex - 1]
          ),
          reason: selectedReasonsObj
        }
      });
    }
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
      this.props.openGlobalPrompt(`${res}`, "");
      if (jobs && jobs[jobs.length - activeSwipeJobIndex - 2] && !agentId) {
        postViewedJob(jobs[jobs.length - activeSwipeJobIndex - 2].jobId);
      }
    });
    promise.catch(err => {
      this.props.openGlobalPrompt(`${err}`, "error");
    });
  };

  handleViewedJobsClick = () => {
    tracker().on("event", {
      hitName: "browse$viewed_jobs_clicked$header"
    });
    this.props.history.push(routeConfig.viewedJobs);
  };

  handleGoToViewedClick = () => {
    tracker().on("event", {
      hitName: "browse$go_to_viewed_jobs_clicked$card"
    });
    this.props.history.push(routeConfig.viewedJobs);
  };

  // closeCovidMsg = () => {
  //   setCookie("covidMsgCrossed", true);
  //   this.setState({ iscovidMsgShown: false });
  //   tracker().on("event", {
  //     hitName: `browse$covid_msg_crossed$header`
  //   });
  // };

  render() {
    const {
      // iscovidMsgShown,
      redirectToNoJobsPage,
      renderSampleJobCard,
      isVisitJobSearchStatus,
      isProfileVisibility
    } = this.state;
    const {
      jobs,
      recommendedJobs,
      setJobId,
      postViewedJob,
      agentId,
      setActiveSwipeJobIndex,
      activeSwipeJobIndex
    } = this.props;
    const publicJobDetails = getSessionStorage("publicJobDetails");
    let heading;
    let swipeCardsData =
      jobs && jobs.length && !redirectToNoJobsPage && !renderSampleJobCard
        ? jobs
        : [];

    swipeCardsData =
      swipeCardsData && swipeCardsData.length
        ? swipeCardsData
        : (getSessionStorage("jobs") &&
            getSessionStorage("jobs").length &&
            getSessionStorage("jobs")) ||
          [];
    const maxJobs =
      sessionStorage.getItem("totalJobCount") ||
      (recommendedJobs && recommendedJobs.totalElements) ||
      swipeCardsData.length;
    if (
      publicJobDetails &&
      Object.keys(publicJobDetails).length > 1 &&
      jobs.length > 0 &&
      getSessionStorage("showPublicJdWarning")
    ) {
      heading = "Jobs that fit your profile better";
    }
    if (publicJobDetails) {
      sessionStorage.removeItem("publicJobDetails");
    }
    if (this.state.showLoading) {
      return <Loading />;
    }
    return (
      <>
        <RadioGroupModal
          open={!isProfileVisibility && !isVisitJobSearchStatus}
          handleRadioChange={this.handleJobSearchStatusModalSubmit}
          closeModal={() => {}}
          title="Where are you in your job search?"
          config={getJobSearchStatusConfig.formFields}
          slideUp
        />
        <RadioGroupModal
          open={!isProfileVisibility && isVisitJobSearchStatus}
          handleRadioChange={this.handleProfilePrivacyModalSubmit}
          closeModal={() => {}}
          title="Profile visibility"
          config={getProfilePrivacyConfig.formFields}
          slideUp
        />
        <div className="spreadHr">
          {heading && (
            <div className="NewJobs__heading">
              <PageHeading title={heading} className="fontSize_19" />
            </div>
          )}
          {!heading && (
            <div
              className={`NewJobs__heading ${
                swipeCardsData.length && maxJobs > 0 ? "" : "hasLogo"
              }`}
            >
              <PageHeading
                title={
                  swipeCardsData.length && maxJobs > 0 ? (
                    `New Jobs (${prependZero(maxJobs)})`
                  ) : (
                    <img src={LogoSmall} width="22" alt="bigshyft logo" />
                  )
                }
              />
            </div>
          )}
          {recommendedJobs && recommendedJobs.totalJobsAcrossAllCategories > 0 && (
            <button
              className="textButton viewedJobsCTA"
              onClick={this.handleViewedJobsClick}
              type="submit"
            >
              Viewed Jobs
            </button>
          )}
        </div>
        <a
          className="openInAppBar"
          href={isMobileDevice() ? appRedirectUrl : appRedirectUrlFromAPI}
          target={isMobileDevice() ? undefined : "_blank"}
          onClick={() => {
            trackCleverTap("GetAppClicked_Browse");
            tracker().on("event", {
              hitName: "browse$get_the_app_clicked$header"
            });
          }}
          rel="noopener noreferrer"
        >
          <span>Open in app</span>{" "}
          {renderSampleJobCard
            ? "to get instant updates on new jobs"
            : "to get instant updates on your applies"}
        </a>
        {/* {iscovidMsgShown && (
          <CovidMessageBar className="isLayered" onClose={this.closeCovidMsg} />
        )} */}
        {swipeCardsData && swipeCardsData.length > 0 ? (
          <>
            <SwipeCards
              data={swipeCardsData}
              lastCard={LastJobCard}
              getNextPageData={this.props.getRecommendedJobsPostView}
              setJobId={setJobId}
              postViewedJob={postViewedJob}
              setActiveSwipeJobIndex={setActiveSwipeJobIndex}
              activeSwipeJobIndex={activeSwipeJobIndex}
              maxJobs={parseInt(maxJobs, 10)}
              totalElements={recommendedJobs && recommendedJobs.totalElements}
              handleGoToViewedClick={this.handleGoToViewedClick}
              agentId={agentId}
            >
              <CompanyDetails isJobCard />
              <FilterProps
                filter="jobData"
                wrapper
                className="jobCard__DescriptionWrapper"
              >
                <JobsViewBookmark
                  onBookmarkClick={this.handleBookmarkClick}
                  onRemoveBookmarkClick={this.handleRemoveBookmarkClick}
                />
                <List />
                <JobsViewActionWrapper
                  handleRemoveJobClick={this.handleRemoveJobClick}
                  handleKnowMoreClick={this.handleKnowMoreClick}
                />
              </FilterProps>
            </SwipeCards>

            <RemoveJobModal
              cancelRemoveJob={this.cancelRemoveJob}
              closeModal={this.crossRemoveJobModal}
              submitRemoveJob={this.handleSubmitRemoveJob}
              jobId={this.state.jobIdToRemove}
              open={this.state.showRemoveJobModal}
            />
          </>
        ) : renderSampleJobCard ? (
          <SampleJobCard />
        ) : redirectToNoJobsPage ? (
          <NoJobs {...this.props} />
        ) : (
          <Loading />
        )}
      </>
    );
  }
}

JobsView.propTypes = {
  recommendedJobs: PropTypes.object,
  getRecommendedJobs: PropTypes.func,
  // jobs: PropTypes.array,
  postUpdateUserProfile: PropTypes.func,
  history: PropTypes.object,
  userLogout: PropTypes.func,
  location: PropTypes.object,
  activeSwipeJobIndex: PropTypes.number,
  setBookmark: PropTypes.func,
  deleteBookmark: PropTypes.func,
  removeJob: PropTypes.func,
  openGlobalPrompt: PropTypes.func,
  getRecommendedJobsPostView: PropTypes.func,
  setJobId: PropTypes.func,
  postViewedJob: PropTypes.func,
  setActiveSwipeJobIndex: PropTypes.func,
  agentId: PropTypes.number
};

JobsView.defaultProps = {
  postUpdateUserProfile: () => {},
  recommendedJobs: {},
  getRecommendedJobs: () => {},
  // jobs: [],
  history: {},
  location: {},
  userLogout: () => {},
  activeSwipeJobIndex: 0,
  setBookmark: () => {},
  deleteBookmark: () => {},
  removeJob: () => {},
  openGlobalPrompt: () => {},
  getRecommendedJobsPostView: () => {},
  setJobId: () => {},
  postViewedJob: () => {},
  setActiveSwipeJobIndex: () => {},
  agentId: ""
};

export default JobsView;
