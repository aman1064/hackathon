import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Button from "../../../../../ui-components/Button";
import Chip from "../../../../../ui-components/Chip";
import ShareWidget from "../ShareWidget";
import RecommendedJobs from "../RecommendedJobs";
import AttemptStats from "../AttemptStats";
import ConceptStats from "../ConceptStats";
import ComparisonStats from "../ComparisonStats";
import PracticeHeader from "../PracticeHeader";
import LeaderWidget from "../LeaderWidget";
import PageLoadFail from "../../../../templates/PageLoadFail";
import DataIncomplete from "../DataIncomplete";
import QuizInsightsShimmer, {
  QuizInsightsHeaderShimmer
} from "./QuizInsightsShimmer";

import routeConfig from "../../../../../constants/routeConfig";
import get from "../../../../../utils/jsUtils/get";
import { getUrl } from "../../../../../utils/getUrl";
import Urlconfig from "../../../../../constants/Urlconfig";
import tracker from "../../../../../analytics/tracker";

import * as practiceActions from "../../redux/PracticeActionsCreators";
import { resetContestQuest } from "../Contest/saga/actionCreator";

import downloadImg from "../../../../../assets/images/svg/download.svg";

import "./QuizInsights.scss";

class QuizInsights extends PureComponent {
  constructor() {
    super();
    this.state = {
      isComparisonStatsInViewport: false,
      isConceptStatsInViewport: false,
      isQuickUpdateOpen: false
    };
    this.comparisonRef = React.createRef();
    this.conceptRef = React.createRef();
    this.selfcomparisonRef = React.createRef();
  }

  componentDidMount() {
    const {
      getAttemptInsights,
      accessToken,
      history,
      match,
      isPerformanceHistory,
      resetContestQuest: _resetContestQuest
    } = this.props;
    if (!isPerformanceHistory) {
      localStorage.removeItem("isBackNotAllowed");
      _resetContestQuest();
      if (!accessToken) {
        history.push(routeConfig.practice);
      } else {
        getAttemptInsights(match.params.id);
      }
      tracker().on("ctapPageView", {
        hitName: "pv_contest_insights",
        payload: {
          page_name: "js_contest_insights",
          ct: true
        }
      });
    }
  }

  componentDidUpdate() {
    const { match, insights, getAttemptInsights, performanceData } = this.props;
    this.createIntersectionObserver();
    // if (this.comparisonRef.current && !this.observer) {
    //   this.createIntersectionObserver();
    // }
    // special case: clicked on "your performance" link if already on performance page
    if (
      insights.data &&
      !match.params.id &&
      insights.data.contestData.attemptId !== performanceData.data[0].attemptId
    ) {
      getAttemptInsights(performanceData.data[0].attemptId);
      this.resetIntersectionObserver();
    }
  }

  handleIntersection = entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.value.includes("chartsCntnr")) {
          this.setState({ isConceptStatsInViewport: true });
        } else if (entry.target.classList.value.includes("ComparisonStats")) {
          this.setState({ isComparisonStatsInViewport: true });
        }
        this.observer.unobserve(entry.target);
      }
    });
  };

  onAttemptChange = (attemptId, previousAttemptId) => () => {
    const { history, getAttemptInsights } = this.props;
    getAttemptInsights(attemptId, previousAttemptId);
    history.push(
      routeConfig.practicePerformanceHistoryWithId.replace(":id", attemptId)
    );
    this.resetIntersectionObserver();
  };

  closeQuickUpdate = () => {
    this.setState({ isQuickUpdateOpen: false });
  };

  openQuickUpdate = () => {
    this.setState({ isQuickUpdateOpen: true });
  };

  createIntersectionObserver() {
    const { isConceptStatsInViewport } = this.state;
    if (!isConceptStatsInViewport) {
      this.setState({
        isConceptStatsInViewport: true,
        isComparisonStatsInViewport: true
      });
    }
    // this.observer = new IntersectionObserver(this.handleIntersection, {
    //   threshold: 0.7
    // });
    // if (this.comparisonRef.current && this.observer) {
    //   this.observer.observe(this.comparisonRef.current);
    // } else {
    //   this.setState({ isComparisonStatsInViewport: true });
    // }
    // if (this.conceptRef.current && this.observer) {
    //   this.observer.observe(this.conceptRef.current);
    // } else {
    //   this.setState({ isConceptStatsInViewport: true });
    // }
  }

  resetIntersectionObserver() {
    const { isConceptStatsInViewport } = this.state;
    if (isConceptStatsInViewport) {
      this.setState({
        isConceptStatsInViewport: false,
        isComparisonStatsInViewport: false
      });
    }
    // if (this.observer) {
    //   this.observer.disconnect();
    //   this.observer = null;
    //   this.setState({
    //     isComparisonStatsInViewport: false,
    //     isConceptStatsInViewport: false
    //   });
    // }
  }

  render() {
    const {
      getRecommendedJobsInQuiz,
      recommendedJobs,
      insights,
      getLeaderboardData,
      leaderBoardData,
      profileId,
      location,
      userName,
      isPerformanceHistory,
      performanceData,
      selectedAttemptId,
      history
    } = this.props;
    const {
      isComparisonStatsInViewport,
      isConceptStatsInViewport,
      isQuickUpdateOpen
    } = this.state;
    const {
      group = "",
      groupId = "",
      totalScore,
      id: contestId,
      title = "",
      attemptId,
      startTime
    } = get(insights, "data.contestData") || {};
    const userPassed =
      insights.data &&
      insights.data.userAttempt &&
      totalScore &&
      insights.data.userAttempt.totalScore >= 0.65 * totalScore;

    const userTotalScore = get(insights, "data.userAttempt.totalScore") || 0;
    const { totalDistinctUserAttempts } = insights.data || {};
    return (
      <div className="Practice QuizInsights">
        <PracticeHeader
          shareTitle={
            isPerformanceHistory
              ? `Get detailed insights on your skills by attempting real life questions on Bigshyft.`
              : `I just took ${group} skill test on BigShyft and got some wonderful insights about my skills. I highly recommend you to try it out.`
          }
          shareUrl={
            isPerformanceHistory
              ? "https://bsyft.ai/I8fSUc"
              : "https://bsyft.ai/YAFKcW"
          }
          history={history}
        />
        {insights.isError && <PageLoadFail />}
        {insights.isLoading && <QuizInsightsHeaderShimmer />}
        {!insights.isError && (
          <>
            {!isPerformanceHistory && insights.data && (
              <div className="headingCntnr">
                {userPassed && (
                  <div className="textContent">
                    <h1>
                      Well done {userName}!
                      <span className="highlight">You’ve passed the test.</span>
                    </h1>
                    <p className="comparisonTxt">
                      You performed{" "}
                      <span className="highlight">
                        {parseInt(
                          ((totalDistinctUserAttempts -
                            insights.data.userAttempt.index) /
                            totalDistinctUserAttempts) *
                            100,
                          10
                        )}
                        % better
                      </span>{" "}
                      than candidates with your skills and experience.
                    </p>
                  </div>
                )}
                {userPassed && (
                  <div className="btnCntnr">
                    <a
                      href={getUrl(
                        Urlconfig.downloadCertificate(
                          contestId,
                          profileId,
                          attemptId
                        )
                      )}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button appearance="secondary">
                        <img
                          className="downloadIcon"
                          src={downloadImg}
                          alt="download icon"
                        />
                        Download Certificate
                      </Button>
                    </a>
                  </div>
                )}
                {!userPassed && insights.data && (
                  <div className="textContent">
                    {" "}
                    <h1>
                      Dear {userName}!{" "}
                      <span className="highlight">
                        You can do better with some practice
                      </span>
                    </h1>
                    {!insights.data.showUserInsights ? (
                      <p className="comparisonTxt">
                        We recommend that you brush up {group} skills and
                        attempt the test again
                      </p>
                    ) : (
                      <p className="comparisonTxt">
                        We recommend that you brush up {group} skills as you
                        scored{" "}
                        <span className="highlight isFail">
                          {65 -
                            parseInt((userTotalScore / totalScore) * 100, 10)}
                          % less
                        </span>{" "}
                        than the cutoff score
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            {isPerformanceHistory && insights.data && (
              <div className="headingCntnr isPerformance">
                <div className="textContent">
                  <h1>Your Performance History</h1>
                  <div className="scrollCntnr">
                    <div className="chipsCntnr">
                      {performanceData.data.map(el => (
                        <Chip
                          key={el.attemptId}
                          appearance={
                            el.attemptId === selectedAttemptId
                              ? "secondary"
                              : "primary"
                          }
                          label={el.quizTitle}
                          onClick={this.onAttemptChange(
                            el.attemptId,
                            el.previousAttemptId
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="insightsCntnr">
              <div className="insightsLeft">
                {insights.isLoading && <QuizInsightsShimmer />}
                {insights.data && (
                  <>
                    {(insights.data.userAttempt ||
                      !insights.data.showUserInsights) && (
                      <AttemptStats
                        userAttempt={insights.data.userAttempt}
                        selectedContest={insights.data.contestData}
                        showUserInsights={insights.data.showUserInsights}
                      />
                    )}
                    {insights.data.showUserInsights && (
                      <ConceptStats
                        ref={this.conceptRef}
                        isInViewport={isConceptStatsInViewport}
                        chartingData={insights.data.chartingData}
                        strength={insights.data.strength}
                        weakness={insights.data.weakness}
                      />
                    )}
                    {insights.data.userAttempt &&
                      insights.data.showUserInsights && (
                        <ComparisonStats
                          ref={this.comparisonRef}
                          isInViewport={isComparisonStatsInViewport}
                          userAttempt={insights.data.userAttempt}
                          topperAttempt={insights.data.topperAttempt}
                          selectedContest={insights.data.contestData}
                        />
                      )}
                    {isPerformanceHistory &&
                      insights.data.userAttempt &&
                      insights.data.pastAttempt && (
                        <ComparisonStats
                          ref={this.selfcomparisonRef}
                          isInViewport
                          userAttempt={insights.data.pastAttempt}
                          topperAttempt={insights.data.userAttempt}
                          selectedContest={insights.data.contestData}
                          isSelfComparison
                        />
                      )}
                    {insights.data && !insights.data.showUserInsights && (
                      <DataIncomplete
                        testName={title}
                        contestId={contestId}
                        lastAttemptTime={startTime}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="insightsRight">
                <ShareWidget
                  quizName={group}
                  shareTitle={
                    isPerformanceHistory
                      ? `Get detailed insights on your skills by attempting real life questions on Bigshyft.`
                      : `I just took ${group} skill test on BigShyft and got some wonderful insights about my skills. I highly recommend you to try it out.`
                  }
                  shareUrl={
                    isPerformanceHistory
                      ? "https://bsyft.ai/I8fSUc"
                      : "https://bsyft.ai/YAFKcW"
                  }
                />
                {contestId && (
                  <LeaderWidget
                    getLeaderboardData={getLeaderboardData}
                    contestId={contestId}
                    quizName={title}
                    leaderBoardData={leaderBoardData}
                    profileId={profileId}
                  />
                )}
                {!contestId && (
                  <LeaderWidget
                    getLeaderboardData={getLeaderboardData}
                    quizName={group}
                    leaderBoardData={leaderBoardData}
                    profileId={profileId}
                  />
                )}
                {groupId && (
                  <RecommendedJobs
                    queryParams={location.search}
                    recommendedJobs={recommendedJobs}
                    getRecommendedJobs={getRecommendedJobsInQuiz}
                    groupId={groupId}
                  />
                )}
                {!groupId && (
                  <RecommendedJobs
                    queryParams={location.search}
                    recommendedJobs={recommendedJobs}
                    getRecommendedJobs={getRecommendedJobsInQuiz}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

QuizInsights.propTypes = {
  accessToken: PropTypes.string,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  getRecommendedJobsInQuiz: PropTypes.func.isRequired,
  getAttemptInsights: PropTypes.func.isRequired,
  userName: PropTypes.string,
  recommendedJobs: PropTypes.object,
  insights: PropTypes.object,
  leaderBoardData: PropTypes.object,
  profileId: PropTypes.string,
  getLeaderboardData: PropTypes.func.isRequired,
  isPerformanceHistory: PropTypes.bool,
  performanceData: PropTypes.object,
  selectedAttemptId: PropTypes.string,
  resetContestQuest: PropTypes.func.isRequired
};

QuizInsights.defaultProps = {
  accessToken: "",
  recommendedJobs: { data: null, isError: false, isLoading: false },
  userName: "",
  insights: {
    data: null,
    isError: false,
    isLoading: false
  },
  leaderBoardData: { data: null, isError: false, isLoading: false },
  profileId: null,
  isPerformanceHistory: false,
  performanceData: { data: null, isError: false, isLoading: false },
  selectedAttemptId: ""
};

const mapSTP = ({ commonData, practice }) => ({
  accessToken: commonData.userDetails.accessToken,
  profileId:
    commonData.userDetails.profile && commonData.userDetails.profile.id,
  userName: commonData.userDetails.name,
  recommendedJobs: practice.recommendedJobs,
  insights: practice.insights,
  leaderBoardData: practice.leaderboard,
  selectedContest: practice.selectedContest
});

const mapDTP = { ...practiceActions, resetContestQuest };

export default connect(mapSTP, mapDTP)(QuizInsights);
