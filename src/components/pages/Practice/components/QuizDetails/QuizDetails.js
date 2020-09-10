import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import QuizList from "../QuizList";
import PracticeHeader from "../PracticeHeader";
import ShareWidget from "../ShareWidget";
import RecommendedJobs from "../RecommendedJobs";
import QuizSteps from "../QuizSteps";
import LeaderWidget from "../LeaderWidget";
import PageLoadFail from "../../../../templates/PageLoadFail";

import smoothScroll from "../../../../../utils/smoothScroll";
import isMobileDevice from "../../../../../utils/isMobileDevice";
import tracker from "../../../../../analytics/tracker";

import * as practiceActions from "../../redux/PracticeActionsCreators";
import { resetContestQuest } from "../Contest/saga/actionCreator";

import "./QuizDetails.scss";

class QuizDetails extends PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { match } = this.props;
    tracker().on("ctapPageView", {
      hitName: "pv_group_details",
      payload: {
        page_name: "js_group_details",
        groupId: match.params.id,
        ct: true
      }
    });
  }

  static getDerivedStateFromProps(props, prevState) {
    let addToState = {};
    const { quizList, match } = props;
    if (quizList.data && match.params.id) {
      addToState = quizList.data.find(el => el.groupId === match.params.id);
    }
    if (prevState.groupId !== match.params.id) {
      props.getQuizDetails({ groupId: match.params.id });
      smoothScroll(
        0,
        0,
        isMobileDevice()
          ? window
          : document.getElementById("QuizDetails") || undefined
      );
    }
    return addToState;
  }

  afterShare = () => {};

  render() {
    const {
      quizList,
      getQuizList,
      quizDetails,
      match,
      getRecommendedJobsInQuiz,
      recommendedJobs,
      getLeaderboardData,
      leaderBoardData,
      profileId,
      setSelectedQuiz,
      history,
      location,
      resetContestQuest: _resetContestQuest
    } = this.props;
    const { groupLogo, group, groupId } = this.state;
    return (
      <div className="Practice QuizDetails" id="QuizDetails">
        <PracticeHeader
          shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
          shareUrl="https://bsyft.ai/NjxrmG"
          history={history}
        />
        <div className="quizDetails">
          {quizDetails.isError && <PageLoadFail />}
          {!quizDetails.isError && (
            <>
              {group && (
                <div className="qdHeading">
                  <div className="imgCntnr">
                    <img src={groupLogo} alt="quiz logo" />
                  </div>
                  <div className="qdHeadingContent">
                    <h1>{group} Skills Test</h1>
                    <p className="qdInst">
                      {quizDetails.data &&
                        `Score 65% or more in the test to earn a Certificate`}
                    </p>
                  </div>
                </div>
              )}

              <div className="qdCntnr">
                <div className="qdLeft">
                  <QuizSteps
                    quizDetails={quizDetails}
                    groupId={match.params.id}
                    setSelectedQuiz={setSelectedQuiz}
                    history={history}
                    resetContestQuest={_resetContestQuest}
                  />
                  <QuizList
                    className="isQuizDetails"
                    heading="Checkout these Tests too!"
                    description="Other skill tests you might be interested in"
                    quizData={quizList}
                    getQuizList={getQuizList}
                    groupIdToRemove={match.params.id}
                  />
                </div>
                <div className="qdRight">
                  {groupId && (
                    <ShareWidget
                      quizName={group}
                      shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
                      shareUrl="https://bsyft.ai/NjxrmG"
                    />
                  )}
                  <LeaderWidget
                    getLeaderboardData={getLeaderboardData}
                    groupId={groupId}
                    quizName={group}
                    leaderBoardData={leaderBoardData}
                    profileId={profileId}
                  />
                  {groupId && (
                    <RecommendedJobs
                      queryParams={location.search}
                      recommendedJobs={recommendedJobs}
                      getRecommendedJobs={getRecommendedJobsInQuiz}
                      groupId={groupId}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

QuizDetails.propTypes = {
  quizList: PropTypes.object,
  getQuizList: PropTypes.func.isRequired,
  quizDetails: PropTypes.object,
  getQuizDetails: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  getRecommendedJobsInQuiz: PropTypes.func.isRequired,
  recommendedJobs: PropTypes.object,
  getLeaderboardData: PropTypes.func.isRequired,
  leaderBoardData: PropTypes.object,
  profileId: PropTypes.string,
  setSelectedQuiz: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  resetContestQuest: PropTypes.func.isRequired
};

QuizDetails.defaultProps = {
  quizList: { data: null, isError: false, isLoading: false },
  quizDetails: { data: null, isError: false, isLoading: false },
  recommendedJobs: { data: null, isError: false, isLoading: false },
  leaderBoardData: { data: null, isError: false, isLoading: false },
  profileId: null
};

const mapSTP = ({ commonData, practice }) => ({
  profileId:
    commonData.userDetails.profile && commonData.userDetails.profile.id,
  quizList: practice.quizList,
  quizDetails: practice.quizDetails,
  recommendedJobs: practice.recommendedJobs,
  leaderBoardData: practice.leaderboard
});

const mapDTP = { ...practiceActions, resetContestQuest };

export default connect(
  mapSTP,
  mapDTP
)(QuizDetails);
