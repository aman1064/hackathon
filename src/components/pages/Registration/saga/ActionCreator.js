import APP_EVENT from "../AppEvents";
import Urlconfig from "../../../../constants/Urlconfig";
import { getUrl } from "../../../../utils/getUrl";

export function getRegistrationScreenData(profile, resolve) {
  return {
    type: `${APP_EVENT.GET_REGISTRATION_CONFIG}_WATCHER`,
    action_type: `${APP_EVENT.GET_REGISTRATION_CONFIG}_EFFECT`,
    url: Urlconfig.registrationScreenConfig,
    profile,
    resolve
  };
}
export function getNextScreen(
  data,
  resolve = () => {},
  reject = () => {},
  isEdit
) {
  return {
    type: `${APP_EVENT.GET_NEXT_SCREEN}_WATCHER`,
    action_type: `${APP_EVENT.GET_NEXT_SCREEN}_EFFECT`,
    url: getUrl(Urlconfig.postUpdateUserProfile),
    data: data,
    resolve: resolve,
    reject: reject,
    isEdit
  };
}

export const getPrevScreen = (
  currentScreenId,
  resolve = () => {},
  reject = () => {}
) => ({
  type: `${APP_EVENT.GET_PREV_SCREEN}_WATCHER`,
  action_type: `${APP_EVENT.GET_PREV_SCREEN}_EFFECT`,
  data: currentScreenId,
  resolve: resolve,
  reject: reject
});

export const postUpdateUserDetails = (
  url,
  postObj,
  resolve = () => {},
  reject = () => {}
) => ({
  type: `${APP_EVENT.POST_UPDATE_USER_DETAILS}_WATCHER`,
  action_type: `${APP_EVENT.POST_UPDATE_USER_DETAILS}_EFFECT`,
  url,
  postObj,
  resolve,
  reject
});

export function postCompletedProfile(resolve, reject, trackerData) {
  const url = getUrl(Urlconfig.postCompletedProfile);
  return {
    type: `${APP_EVENT.POST_COMPLETED_PROFILE}_WATCHER`,
    action_type: `${APP_EVENT.POST_COMPLETED_PROFILE}_EFFECT`,
    url,
    resolve,
    reject,
    trackerData
  };
}
