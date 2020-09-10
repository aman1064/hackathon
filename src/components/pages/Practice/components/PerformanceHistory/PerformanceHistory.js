import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import QuizInsights from "../QuizInsights";
import BrowseQuiz from "../BrowseQuiz";
import PracticeHeader from "../PracticeHeader";
import ShareWidget from "../ShareWidget";
import LeaderWidget from "../LeaderWidget";
import RecommendedJobs from "../RecommendedJobs";

import QuizInsightsShimmer, {
  PerformanceHistoryHeadingShimmer
} from "../QuizInsights/QuizInsightsShimmer";

import tracker from "../../../../../analytics/tracker";

import * as PracticeActions from "../../redux/PracticeActionsCreators";

class PerformanceHistory extends PureComponent {
  constructor() {
    super();
    this.state = { isMounted: false };
  }

  componentDidMount() {
    const {
      getPerformanceHistory,
      accessToken,
      match,
      getAttemptInsights
    } = this.props;
    if (accessToken) {
      const promise = new Promise(resolve => {
        getPerformanceHistory(resolve);
      });
      promise.then(data => {
        if (match.params.id) {
          const selectedAttempt = data.find(
            el => el.attemptId === match.params.id
          );
          getAttemptInsights(
            selectedAttempt.attemptId,
            selectedAttempt.previousAttemptId
          );
        }
      });
    }
    this.setState({ isMounted: true });
    tracker().on("ctapPageView", {
      hitName: "pv_contest_performance",
      payload: {
        page_name: "js_contest_performance",
        ct: true
      }
    });
  }

  render() {
    const {
      accessToken,
      performanceData,
      location,
      match,
      history,
      getLeaderboardData,
      getRecommendedJobsInQuiz,
      leaderBoardData,
      recommendedJobs
    } = this.props;
    const { isMounted } = this.state;
    let performanceHistory = (
      <div className="Practice QuizInsights">
        <PracticeHeader
          shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
          shareUrl="https://bsyft.ai/I8fSUc"
          history={history}
        />
        <PerformanceHistoryHeadingShimmer />
        <div className="insightsCntnr">
          <div className="insightsLeft">
            <QuizInsightsShimmer />
          </div>
          <div className="insightsRight">
            <ShareWidget
              shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
              shareUrl="https://bsyft.ai/I8fSUc"
            />
            <LeaderWidget
              getLeaderboardData={getLeaderboardData}
              leaderBoardData={leaderBoardData}
            />
            <RecommendedJobs
              getRecommendedJobs={getRecommendedJobsInQuiz}
              recommendedJobs={recommendedJobs}
            />
          </div>
        </div>
      </div>
    );
    if (
      (isMounted && !accessToken) ||
      (accessToken && performanceData.data && !performanceData.data.length)
    ) {
      performanceHistory = (
        <BrowseQuiz
          accessToken={accessToken}
          history={history}
          isPerformanceHistory
        />
      );
    }
    if (
      isMounted &&
      accessToken &&
      performanceData.data &&
      performanceData.data.length
    ) {
      performanceHistory = (
        <QuizInsights
          location={location}
          history={history}
          match={match}
          performanceData={performanceData}
          selectedAttemptId={
            match.params.id || performanceData.data[0].attemptId
          }
          isPerformanceHistory
        />
      );
    }
    return performanceHistory;
  }
}

const mapSTP = ({ commonData, practice }) => ({
  accessToken: commonData.userDetails.accessToken,
  performanceData: practice.performance
});

const mapDTP = { ...PracticeActions };

PerformanceHistory.propTypes = {
  accessToken: PropTypes.string,
  getPerformanceHistory: PropTypes.func.isRequired,
  getAttemptInsights: PropTypes.func.isRequired,
  performanceData: PropTypes.object,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  getLeaderboardData: PropTypes.func.isRequired,
  getRecommendedJobsInQuiz: PropTypes.func.isRequired,
  leaderBoardData: PropTypes.object,
  recommendedJobs: PropTypes.object
};

PerformanceHistory.defaultProps = {
  accessToken: "",
  performanceData: { data: null, isError: false, isLoading: false },
  leaderBoardData: { data: null, isError: false, isLoading: true },
  recommendedJobs: { data: null, isError: false, isLoading: true }
};

export default connect(
  mapSTP,
  mapDTP
)(PerformanceHistory);
