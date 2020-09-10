import Urlconfig from "../../../../../../constants/Urlconfig";
import APP_EVENT from "../AppEvents";
import { getUrl } from "../../../../../../utils/getUrl";

const getContests = () => {
  const url = getUrl(Urlconfig.getContest);
  return {
    type: `${APP_EVENT.GET_CONTEST}_WATCHER`,
    action_type: `${APP_EVENT.GET_CONTEST}_EFFECT`,
    url
  };
};

const getAttemptedTests = profileId => {
  const url = getUrl(Urlconfig.getAttemptedTests(profileId));
  return {
    type: `${APP_EVENT.GET_ATTEMPTED_CONTEST}_WATCHER`,
    action_type: `${APP_EVENT.GET_ATTEMPTED_CONTEST}_EFFECT`,
    url
  };
};

export { getContests, getAttemptedTests };
