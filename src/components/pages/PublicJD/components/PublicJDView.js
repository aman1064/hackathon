import React, { Component } from "react";
import queryString from "query-string";

import Loading from "../../../atoms/Loading";
import JDCompanyDetails from "../../../templates/JDCompanyDetails/JDCompanyDetails";
import JobDetails from "../../../templates/JobDetails/JobDetails";
import Button from "../../../atoms/Button";
import PageHeading from "../../../atoms/PageHeading";
import HelpText from "../../../atoms/HelpText";
import JobsNav from "./JobsNav";
import PageNotFound from "../../../templates/PageNotFound";
import Title from "../../../../ui-components/Modal/Title";
import Modal from "../../../../ui-components/Modal";
import { CovidIcon, ThumbUpIcon } from "../../../atoms/Icon/icons";

import Urlconfig from "../../../../constants/Urlconfig";
import routeConfig from "../../../../constants/routeConfig";
import { getUrl } from "../../../../utils/getUrl";
import { filterJobDetailsForCleverTap } from "../../../../utils/tracking";
import tracker from "../../../../analytics/tracker";
import showOptIn from "../../../../utils/showOptIn";
import { getCookie } from "../../../../utils/Cookie";
import parseJwt from "../../../../utils/parseJwt";
let SeoCounter = 1;
export default class PublicJDView extends Component {
  constructor(props) {
    super(props);
    this.jobId = this.props.match.params && this.props.match.params.jobId;
    this.isContestFlow = props.location.search.includes("contest=true");
    this.state = {
      isApplied: false,
      isMultiple: false
    };
    this.oldScroll = 0;
  }

  static getDerivedStateFromProps(nextProps) {
    const { jobs } = queryString.parse(nextProps.location.search);
    const jobsArr = (jobs && jobs.split(",")) || [];
    if (jobsArr.length > 1) {
      return {
        isMultiple: true,
        jobsArr,
        currentJobIndex: jobsArr.indexOf(nextProps.match.params.jobId)
      };
    }
    return null;
  }

  componentDidMount() {
    const { location, jobDetails } = this.props;

    window.sessionStorage.setItem("isPublicJDPage", true);
    const { seoApply } = queryString.parse(this.props.location.search);
    if (
      location.state &&
      location.state.isApplyWithCv &&
      !jobDetails.appliedDate
    ) {
      this.handleApplyWithForceRecommend();
    }
    if (seoApply && SeoCounter === 1) {
      this.loadJobDetails(this.jobId, null, true, true);
      SeoCounter = 2;
    } else {
      this.loadJobDetails(this.jobId, null, true);
    }

    window.addEventListener("scroll", this.handleJDScroll);
    window.scrollTo(0, 0);
  }

  componentDidUpdate() {
    const {
      match: { params },
      accessToken
    } = this.props;
    if (
      this.state.isMultiple &&
      accessToken &&
      ((this.state.jobFetchErr && params.jobId !== this.state.invalidJobId) ||
        (this.jobId !== params.jobId && !this.state.jobFetchErr))
    ) {
      this.loadJobDetails(params.jobId);
    }
  }

  componentWillUnmount() {
    // window.sessionStorage.removeItem("isPublicJDPage");
    window.removeEventListener("scroll", this.handleJDScroll);
  }
  handleJDScroll = () => {
    if (window.scrollY > 80 && !this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: true });
    } else if (window.scrollY <= 80 && this.state.isHeaderSticky) {
      this.setState({ isHeaderSticky: false });
    }

    if (window.scrollY > 180 && !this.state.isHeaderBordered) {
      this.setState({ isHeaderBordered: true });
    } else if (window.scrollY <= 180 && this.state.isHeaderBordered) {
      this.setState({ isHeaderBordered: false });
    }

    if (this.state.isHeaderBordered && this.oldScroll > window.scrollY) {
      // scroll up
      this.setState({ scrollHeaderDown: true, scrollHeaderUp: false });
    } else if (window.scrollY > 240 && this.oldScroll < window.scrollY) {
      // scroll down
      this.setState({ scrollHeaderDown: false, scrollHeaderUp: true });
    } else {
      this.setState({ scrollHeaderDown: false, scrollHeaderUp: false });
    }
    this.oldScroll = window.scrollY;
  };
  handleApplyWithForceRecommend = () => {
    const { whatsappSubscription } = this.props;
    const jobDetails = this.props.jobDetails;
    const isAgentProcess = parseJwt();
    const showOptInModal =
      !isAgentProcess &&
      !whatsappSubscription &&
      showOptIn(
        getCookie("lastRejectTime") || 0,
        getCookie("rejectCount") || 0
      );
    new Promise((resolve, reject) => {
      this.props.handlepublicJDApply(resolve, reject, !showOptInModal);
    }).then(res => {
      if (showOptInModal) {
        this.props.showWhatsappOptIn(true, true, "InstaApply Flow");
      }
      const { date, processed } = res.data;
      this.props.jobDetails.appliedDate = date;

      this.setState({
        isApplied: true
      });
      if (res.status >= 200 && res.status < 300) {
        tracker().on("ctapEvent", {
          hitName: `apply_success${this.isContestFlow ? "_contest" : ""}`,
          payload: {
            from_page: "public_jd",
            ...filterJobDetailsForCleverTap(jobDetails)
          }
        });
        tracker().on("ctapProfile", {
          hitName: "apply_success",
          payload: {
            does_cv_exist: true,
            is_profile_complete: true
          }
        });
      }

      if (res.status === 200 && processed) {
        this.props.openGlobalPrompt(
          "Application sent to recruiter successfully",
          "success"
        );
        SeoCounter = 1;
      }
      this.props.history.push(routeConfig.jobs);
    });
  };
  handleApplyClick = () => {
    const {
      jobDetails,
      accessToken,
      isUserProfileCompleted,
      profile,
      cvInProfile
    } = this.props;
    tracker().on("event", {
      hitName: `Public_JD$apply_clicked$detailed_jd$${jobDetails.jobId}`
    });
    tracker().on("ctapEvent", {
      hitName: `public_jd_apply_click${this.isContestFlow ? "_contest" : ""}`,
      payload: {
        page_name: "js_public_jd",
        ...filterJobDetailsForCleverTap(jobDetails),
        total_job_count: (this.state.jobsArr && this.state.jobsArr.length) || 1
      }
    });

    window.sessionStorage.setItem(
      "publicJobDetails",
      JSON.stringify(jobDetails)
    );
    if (accessToken) {
      if (isUserProfileCompleted) {
        // user profile complete
        if (!cvInProfile) {
          this.openApplyWithCVModal();
        } else {
          this.handleApplyWithForceRecommend();
        }
      } else {
        // user profile incomplete
        const { latestCompanyDetails = {} } = profile;
        if (
          cvInProfile &&
          latestCompanyDetails.ctc &&
          latestCompanyDetails.noticePeriodData
        ) {
          new Promise((resolve, reject) => {
            this.props.handlepublicJDApply(resolve, reject, false);
          }).then(() => {
            this.props.history.push({
              pathname: `${routeConfig.instaApplyUpdate.replace(
                ":jobId",
                this.props.match.params.jobId
              )}${this.props.location.search}`
            });
          });
        } else {
          this.props.history.push(
            `${routeConfig.instaApply.replace(":jobId", this.jobId)}${
              this.props.location.search
            }`
          );
        }
      }

      //const { latestCompanyDetails = {} } = profile;
      // if (accessToken && (isUserProfileCompleted || ( latestCompanyDetails.ctc &&
      //   latestCompanyDetails.noticePeriodData) )) {
      //     this.props.history.push(`${routeConfig.instaCVUpload.replace(
      //       ":jobId",
      //       this.jobId)}${this.props.location.search}`,{
      //         jobDetails
      //       }
      //     );
    } else {
      this.props.history.push(
        `${routeConfig.instaApply.replace(":jobId", this.jobId)}${
          this.props.location.search
        }`
      );
    }
  };
  closeApplyWithCVModal = () => {
    this.setState({ showApplyWithCVModal: false });
  };

  openApplyWithCVModal = () => {
    this.setState({ showApplyWithCVModal: true });
  };
  handleApplyWithCVClick = () => {
    import(
      /* webpackChunkName: "CV upload config" */ "../../../../assets/json/cvUploadScreen.json"
    ).then(res => {
      const promise = new Promise((resolve, reject) => {
        this.props.updateCurrentScreenWithPromise(res.default, resolve, reject);
      });
      promise.then(() => {
        this.props.history.push(routeConfig.applyWithCV, {
          isEdit: true,
          isApplyWithCv: true,
          isPublicJDPageCvUpload: true,
          pathname: this.props.location.pathname
        });
      });
    });
  };

  loadJobDetails = (jobId, direction, sendCtapEvent, sendManualApply) => {
    if (direction) {
      tracker().on("event", {
        hitName: `Public_JD$${direction}_clicked$detailed_jd`
      });
    }
    const { isUserProfileCompleted, accessToken, jobDetails = {} } = this.props;
    if (this.state.jobFetchErr) {
      this.setState({ jobFetchErr: false });
    }
    if (
      jobDetails &&
      jobDetails.jobId === jobId &&
      this.jobId &&
      this.jobId === jobId &&
      this.state.isMultiple &&
      accessToken
    ) {
      return false;
    }
    jobDetails.jobId = jobId;
    this.jobId = jobId;

    let jobDetailsUrl;
    if (accessToken && isUserProfileCompleted) {
      jobDetailsUrl = getUrl(Urlconfig.jobDetails.replace("{jobId}", jobId));
    } else {
      jobDetailsUrl = Urlconfig.getQuickJobDetails.replace("{jobId}", jobId);
    }
    if (jobId) {
      const promise = new Promise((resolve, reject) => {
        this.props.getJobDetails(resolve, reject, jobDetailsUrl);
      });
      promise.then(res => {
        window.__bgperformance.pageMeasure();
        if (sendManualApply && !res.appliedDate) {
          this.handleApplyClick();
        }
        if (sendCtapEvent) {
          tracker().on("ctapPageView", {
            hitName: `pv_public_jd${this.isContestFlow ? "_contest" : ""}`,
            payload: {
              page_name: "js_public_jd",
              ...filterJobDetailsForCleverTap(res),
              total_job_count:
                (this.state.jobsArr && this.state.jobsArr.length) || 1
            }
          });
          tracker().on("event", {
            hitName: `Public_JD$public_jd_viewed$detailed_jd$${res &&
              res.jobId}`
          });
        }
      });
      promise.catch(() => {
        jobDetails.jobId = "";
        window.__bgperformance.pageMeasure();
        this.setState({ jobFetchErr: true, invalidJobId: jobId });
      });
    }
  };

  render() {
    const { jobDetails, aboutCompany, match } = this.props;
    const { currentJobIndex, jobsArr, isMultiple, jobFetchErr } = this.state;
    const { noapply } = queryString.parse(this.props.location.search);
    const isApplied =
      jobDetails && jobDetails.appliedDate
        ? jobDetails.appliedDate
        : this.state.isApplied;
    const isHideJob =
      jobDetails &&
      ["REJECT", "REJECTED", "APPROVAL_PENDING"].indexOf(jobDetails.status) >
        -1;
    const hiringStatus = jobDetails && jobDetails.hiringStatus;
    if (isHideJob && !isMultiple && !isApplied) {
      return <PageNotFound type="hideJD" />;
    }
    return jobFetchErr ? (
      <PageNotFound />
    ) : jobDetails &&
      jobDetails.jobId === this.jobId &&
      Object.keys(jobDetails).length > 1 ? (
      <div className={isMultiple ? "isMultiple" : ""}>
        {isMultiple && (
          <JobsNav
            currentJobIndex={currentJobIndex}
            jobsArr={jobsArr}
            otherUrlParam={match.params.other}
            loadJobDetails={this.loadJobDetails}
            accessToken={this.props.accessToken}
          />
        )}
        {isHideJob && !isApplied && <PageNotFound type="hideJD" />}
        {!isHideJob && (
          <div>
            <div
              className={`darkBG KnowMore__CompanyDetails onlyTitle  ${
                this.state.isHeaderSticky ? "isHeaderSticky " : ""
              } ${this.state.isHeaderBordered ? "isHeaderBordered" : ""} ${
                this.state.scrollHeaderDown ? "scrollHeaderDown" : ""
              } ${this.state.scrollHeaderUp ? "scrollHeaderUp" : ""} ${
                hiringStatus && hiringStatus !== "NA" ? "hasHiringStatus" : ""
              }`}
            >
              <div className="KnowMore__fixedNav KnowMore__fixedNav--onlyTitle" />
              <JDCompanyDetails
                jobDetails={jobDetails}
                trackerCategory="Public_JD"
              />
            </div>
            {hiringStatus === "ACTIVE" && (
              <div className="JDHiringStatus">
                <ThumbUpIcon size={16} />
                <span>
                  Even during COVID-19 crisis; {jobDetails.companyName} is still
                  actively screening job applications to keep candidates
                  updated. Kudos!
                </span>
              </div>
            )}
            {hiringStatus === "PASSIVE" && (
              <div className="JDHiringStatus">
                <CovidIcon size={20} />
                <span>
                  Response from recruiters might get delayed due to COVID-19
                  effect
                </span>
              </div>
            )}
            <JobDetails
              jobDetails={jobDetails}
              aboutCompany={aboutCompany}
              className="jobDetails"
              trackerCategory="Public_JD"
            />
            <div className="paddingAgainstBottomNav">
              {!(
                jobDetails.status.toLowerCase() === "close" ||
                jobDetails.status.toLowerCase() === "closed"
              ) &&
                !isApplied &&
                !noapply && (
                  <div className="fixButtonToBottom_oneButton">
                    <Button
                      className="publicJdApply"
                      onClick={this.handleApplyClick}
                    >
                      <span id="public_jd_Apply">Apply</span>
                    </Button>
                  </div>
                )}
            </div>

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
                <Button
                  type="link hasHover"
                  onClick={this.handleApplyWithCVClick}
                >
                  Apply with CV
                </Button>
              </div>
            </Modal>
          </div>
        )}
      </div>
    ) : (
      <Loading />
    );
  }
}
