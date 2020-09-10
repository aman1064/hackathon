import Urlconfig from "../../../../../../constants/Urlconfig";
import APP_EVENT from "../AppEvents";
import { getUrl } from "../../../../../../utils/getUrl";

const startContest = (contestId, profileId) => {
  const url = getUrl(Urlconfig.startContest(contestId, profileId));
  return {
    type: `${APP_EVENT.START_CONTEST_QUEST}_WATCHER`,
    action_type: `${APP_EVENT.START_CONTEST_QUEST}_EFFECT`,
    url
  };
};

const submitQuest = (contestId, profileId, payload, resolve = () => {}) => {
  const url = getUrl(Urlconfig.submitContestQuest(contestId, profileId));
  return {
    type: `${APP_EVENT.SUBMIT_CONTEST_QUEST}_WATCHER`,
    action_type: `${APP_EVENT.SUBMIT_CONTEST_QUEST}_EFFECT`,
    payload,
    url,
    resolve
  };
};

const resetSubmitting = () => {
  return {
    type: `${APP_EVENT.RESET_SUBMITTING}_WATCHER`,
    action_type: `${APP_EVENT.RESET_SUBMITTING}_EFFECT`
  };
};

const beginQuizHandle = status => ({
  type: APP_EVENT.BEGIN_QUIZ,
  payload: status || false
});

const resetContestQuest = () => ({
  type: APP_EVENT.RESET_CONTEST_QUEST,
  payload: null
});

export {
  startContest,
  submitQuest,
  beginQuizHandle,
  resetSubmitting,
  resetContestQuest
};
