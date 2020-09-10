import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import PracticeHeader from "../PracticeHeader";
import QuizList from "../QuizList";
import ShareWidget from "../ShareWidget";
import LeaderWidget from "../LeaderWidget";
import Shimmer from "../../../../atoms/Shimmer";

import * as practiceActions from "../../redux/PracticeActionsCreators";

import tracker from "../../../../../analytics/tracker";

import "./BrowseQuiz.scss";

class BrowseQuiz extends PureComponent {
  componentDidMount() {
    const {
      getPerformanceHistory,
      accessToken,
      isPerformanceHistory
    } = this.props;
    if (accessToken && !isPerformanceHistory) {
      getPerformanceHistory();
    }
    tracker().on("ctapPageView", {
      hitName: "pv_contest_browse",
      payload: {
        page_name: "js_contest_browse",
        ct: true
      }
    });
  }

  renderTitle = () => {
    const {
      accessToken,
      performanceData,
      userName,
      isPerformanceHistory
    } = this.props;
    let titleEl = (
      <>
        <Shimmer height={28} width={120} />
        <Shimmer marginTop={24} height={48} width={300} />
      </>
    );
    if (isPerformanceHistory) {
      titleEl = accessToken ? (
        <h1>
          Hi {userName}! To see your performance,{" "}
          <span className="highlighted">Take your first test</span>
        </h1>
      ) : (
        <h1>
          Hi! To see your performance, please <Link to="/login">Login</Link> or{" "}
          <span className="highlighted">Take your first test</span>
        </h1>
      );
    } else if (!accessToken) {
      titleEl = (
        <h1>
          Hi! To get started,{" "}
          <span className="highlighted">Take your first test</span>
        </h1>
      );
    } else if (performanceData.data) {
      titleEl = performanceData.data.length ? (
        <h1>
          Hi {userName}!{" "}
          <span className="highlighted">Test your other skills</span>
        </h1>
      ) : (
        <h1>
          Hi {userName}! To get started,{" "}
          <span className="highlighted">Take your first test</span>
        </h1>
      );
    }
    return titleEl;
  };

  render() {
    const {
      getQuizList,
      quizList,
      getLeaderboardData,
      leaderBoardData,
      profileId,
      history
    } = this.props;
    return (
      <div className="Practice BrowseQuiz">
        <PracticeHeader
          shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
          shareUrl="https://bsyft.ai/1SmWFn"
          history={history}
        />
        <div className="browseTitle">{this.renderTitle()}</div>
        <div className="browseCntnr">
          <div className="browseLeft">
            <QuizList
              getQuizList={getQuizList}
              quizData={quizList}
              className="isQuizDetails"
              heading="Choose from the list below"
              description="These are the most trending tests"
              threshold={8}
            />
          </div>
          <div className="browseRight">
            <ShareWidget
              shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
              shareUrl="https://bsyft.ai/1SmWFn"
              className="universalShare"
            />
            {quizList.data && (
              <LeaderWidget
                getLeaderboardData={getLeaderboardData}
                groupId={quizList.data[0].groupId}
                quizName={quizList.data[0].group}
                quizList={quizList}
                leaderBoardData={leaderBoardData}
                profileId={profileId}
                showDropdownVariant
              />
            )}
            {!quizList.data && (
              <LeaderWidget
                getLeaderboardData={getLeaderboardData}
                quizList={quizList}
                leaderBoardData={leaderBoardData}
                profileId={profileId}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

BrowseQuiz.propTypes = {
  accessToken: PropTypes.string,
  profileId: PropTypes.string,
  getQuizList: PropTypes.func.isRequired,
  quizList: PropTypes.object,
  userName: PropTypes.string,
  getLeaderboardData: PropTypes.func.isRequired,
  leaderBoardData: PropTypes.object,
  getPerformanceHistory: PropTypes.func.isRequired,
  isPerformanceHistory: PropTypes.bool,
  performanceData: PropTypes.object,
  history: PropTypes.object.isRequired
};

BrowseQuiz.defaultProps = {
  accessToken: "",
  userName: "",
  quizList: { data: null, isError: false, isLoading: false },
  leaderBoardData: { data: null, isError: false, isLoading: false },
  profileId: null,
  isPerformanceHistory: false,
  performanceData: { data: null, isError: false, isLoading: false }
};

const mapSTP = ({ commonData, practice }) => ({
  accessToken: commonData.userDetails.accessToken,
  quizList: practice.quizList,
  userName: commonData.userDetails.name,
  profileId: commonData.userDetails.profile.id,
  leaderBoardData: practice.leaderboard,
  performanceData: practice.performance
});

const mapDTP = { ...practiceActions };

export default connect(
  mapSTP,
  mapDTP
)(BrowseQuiz);
