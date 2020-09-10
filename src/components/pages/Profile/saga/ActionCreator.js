import Urlconfig from "../../../../constants/Urlconfig";
import APP_EVENT from "../AppEvents";
import { getUrl } from "../../../../utils/getUrl";

export function getBasicUserDetails() {
  const url = getUrl(Urlconfig.getBasicUserDetails);
  return {
    type: `${APP_EVENT.GET_BASIC_USER_DETAILS}_WATCHER`,
    action_type: `${APP_EVENT.GET_BASIC_USER_DETAILS}_EFFECT`,
    url
  };
}
export function getUserProfile(resolve, reject, url) {
  url = url || getUrl(Urlconfig.getUserProfile);
  return {
    type: `${APP_EVENT.GET_USER_PROFILE}_WATCHER`,
    action_type: `${APP_EVENT.GET_USER_PROFILE}_EFFECT`,
    url,
    resolve,
    reject
  };
}

export function updateCurrentScreenWithPromise(data, resolve, reject) {
  return {
    type: `${APP_EVENT.UPDATE_CURRENT_SCREEN_WITH_PROMISE}_WATCHER`,
    action_type: `${APP_EVENT.UPDATE_CURRENT_SCREEN}_EFFECT`,
    data,
    resolve,
    reject
  };
}
export function getProfileEditScreens(prevValue, resolve, reject) {
  return {
    type: `${APP_EVENT.GET_PROFILE_EDIT_SCREENS}_WATCHER`,
    action_type: `${APP_EVENT.GET_PROFILE_EDIT_SCREENS}_EFFECT`,
    url: Urlconfig.getProfileEditScreens,
    prevValue,
    resolve,
    reject
  };
}

export function getJobRoleData(url) {
  url = url ? url : getUrl(Urlconfig.getJobRoleData);
  return {
    type: `${APP_EVENT.GET_JOB_ROLE_DATA}_WATCHER`,
    action_type: `${APP_EVENT.GET_JOB_ROLE_DATA}_EFFECT`,
    url
  };
}
