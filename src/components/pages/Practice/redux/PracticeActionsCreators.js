import APP_EVENT from "./AppEvents";
import Urlconfig from "../../../../constants/Urlconfig";
import { getUrl } from "../../../../utils/getUrl";

export const getQuizList = () => {
  const url = getUrl(Urlconfig.getQuizList);
  return {
    type: `${APP_EVENT.GET_QUIZ_LIST}_WATCHER`,
    action_type: `${APP_EVENT.GET_QUIZ_LIST}_EFFECT`,
    url
  };
};

export const getQuizDetails = ({ groupId }) => {
  const url = getUrl(Urlconfig.getQuizDetails).replace("{groupId}", groupId);
  return {
    type: `${APP_EVENT.GET_QUIZ_DETAILS}_WATCHER`,
    action_type: `${APP_EVENT.GET_QUIZ_DETAILS}_EFFECT`,
    url
  };
};

export const getRecommendedJobsInQuiz = groupId => {
  const url = getUrl(Urlconfig.getRecommendedJobsInQuiz).replace(
    "{groupId}",
    groupId
  );
  return {
    type: `${APP_EVENT.GET_RECOMMENDED_JOBS_IN_QUIZ}_WATCHER`,
    action_type: `${APP_EVENT.GET_RECOMMENDED_JOBS_IN_QUIZ}_EFFECT`,
    url
  };
};

export const getAttemptInsights = (attemptId, previousAttemptId) => {
  let url = getUrl(Urlconfig.getAttemptInsights).replace(
    "{attemptId}",
    attemptId
  );
  if (previousAttemptId) {
    url = `${url}&previousAttemptId=${previousAttemptId}`;
  }
  return {
    type: `${APP_EVENT.GET_ATTEMPT_INSIGHTS}_WATCHER`,
    action_type: `${APP_EVENT.GET_ATTEMPT_INSIGHTS}_EFFECT`,
    url
  };
};

export const getLeaderboardData = url => {
  return {
    type: `${APP_EVENT.GET_LEADERBOARD_DATA}_WATCHER`,
    action_type: `${APP_EVENT.GET_LEADERBOARD_DATA}_EFFECT`,
    url
  };
};

export const setSelectedQuiz = payload => ({
  type: `${APP_EVENT.SET_SELECTED_CONTEST}_EFFECT`,
  action_type: `${APP_EVENT.SET_SELECTED_CONTEST}_EFFECT`,
  payload
});

export const getPerformanceHistory = (resolve = () => {}) => {
  const url = getUrl(Urlconfig.getPerformanceHistory);
  return {
    type: `${APP_EVENT.GET_PERFORMANCE_DATA}_WATCHER`,
    action_type: `${APP_EVENT.GET_PERFORMANCE_DATA}_EFFECT`,
    url,
    resolve
  };
};
