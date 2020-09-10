import { connect } from "react-redux";

import RenderContestScreen from "./components/RenderContestScreen";
import { get, isEmpty } from "../../../../../utils/jsUtils";
import { CONTEST_FORM_NAME } from "./constants";
import {
  beginQuizHandle,
  startContest,
  submitQuest,
  resetSubmitting
} from "./saga/actionCreator";
import { reset } from "../../../../organisms/Field/saga/ActionCreator";
import {
  getAttemptedTests,
  getContests
} from "../ContestListing/saga/actionCreator";

import { openGlobalPrompt } from "../../../../../sagas/ActionCreator";

const mapStateToProps = (state, ownProps) => ({
  values: get(state, `forms.${CONTEST_FORM_NAME}.values`) || {},
  invalid: isEmpty(get(state, `forms.${CONTEST_FORM_NAME}.values.email`)),
  question: get(state, "contestQuest.question"),
  totalQuestionsInQuiz: get(state, "contestQuest.totalQuestionsInQuiz"),
  currentIndex: get(state, "contestQuest.currentIndex"),
  contestAttemptId: get(state, "contestQuest.contestAttemptId"),
  isQuizComplete: get(state, "contestQuest.isQuizComplete"),
  isQuizBegin: get(state, "contestQuest.isQuizBegin"),
  contestId: get(ownProps, "match.params.contestId"),
  profileId: get(state, "commonData.userDetails.profile.id"),
  accessToken: get(state, "commonData.userDetails.accessToken"),
  attemptedContests: get(state, "contestList.attemptedContests") || [],
  contests: get(state, "contestList.contests") || [],
  submitting: get(state, "contestQuest.questSubmitting"),
  isContestStart: get(state, "contestQuest.isContestStart"),
  totalScore: get(state, "contestQuest.totalScore")
});

const mapDispatchToProps = {
  startContest,
  submitQuest,
  reset,
  beginQuizHandle,
  getAttemptedTests,
  getContests,
  openGlobalPrompt,
  resetSubmitting
};

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const selectedContest =
    stateProps.contests.find(contest => contest.id === stateProps.contestId) ||
    {};
  delete stateProps.contests; // eslint-disable-line no-param-reassign
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    selectedContest
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(RenderContestScreen);
