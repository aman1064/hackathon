import APP_EVENT from "../AppEvents";
import Urlconfig from "../constants/Urlconfig";
import { getUrl } from "../utils/getUrl";
let cachedPromptVariant;

export function userLogin(resolve, reject, data, url, pageName) {
  url = url || Urlconfig.login;
  return {
    type: `${APP_EVENT.USER_LOGIN}_WATCHER`,
    action_type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    data,
    url,
    resolve,
    reject,
    pageName
  };
}
export function socialLogin(resolve, reject, data, url, pageName) {
  return {
    type: `${APP_EVENT.SOCIAL_LOGIN}_WATCHER`,
    action_type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    data,
    url,
    resolve,
    reject,
    pageName
  };
}

export function userRegistration(resolve, reject, registrationData) {
  return {
    type: `${APP_EVENT.USER_REGISTRATION}_WATCHER`,
    action_type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    data: registrationData,
    resolve,
    reject
  };
}

export function updateUserProfile(data) {
  return {
    type: `${APP_EVENT.UPDATE_USER_PROFILE}_WATCHER`,
    action_type: `${APP_EVENT.UPDATE_USER_PROFILE}_EFFECT`,
    data
  };
}

export const openGlobalPrompt = (
  msg,
  variant = "default",
  info,
  icon,
  messageClass,
  iconSize
) => {
  cachedPromptVariant = variant;
  return {
    type: `${APP_EVENT.OPEN_GLOBAL_PROMPT}_WATCHER`,
    action_type: `${APP_EVENT.OPEN_GLOBAL_PROMPT}_EFFECT`,
    data: {
      isOpen: true,
      variant,
      msg,
      info,
      icon,
      messageClass,
      iconSize
    }
  };
};

export const closeGlobalPrompt = () => ({
  type: `${APP_EVENT.CLOSE_GLOBAL_PROMPT}_WATCHER`,
  action_type: `${APP_EVENT.CLOSE_GLOBAL_PROMPT}_EFFECT`,
  data: {
    isOpen: false,
    variant: cachedPromptVariant,
    msg: null
  }
});

export const userLogout = () => ({
  type: `${APP_EVENT.USER_LOGOUT}_WATCHER`,
  action_type: `${APP_EVENT.USER_LOGOUT}_EFFECT`,
  url: Urlconfig.userLogout
});

export const setJobId = (jobId, resolve = () => {}) => {
  return {
    type: `${APP_EVENT.SET_JOBID}_WATCHER`,
    action_type: `${APP_EVENT.SET_JOBID}_EFFECT`,
    jobId,
    resolve
  };
};

export const setMobileNumberExists = data => ({
  type: `${APP_EVENT.SET_MOBILE_NUMBER_EXISTS}_WATCHER`,
  action_type: `${APP_EVENT.SET_MOBILE_NUMBER_EXISTS}_EFFECT`,
  data
});
export const postUserPing = () => ({
  type: `${APP_EVENT.POST_USER_PING}_WATCHER`,
  action_type: `${APP_EVENT.POST_USER_PING}_EFFECT`,
  url: Urlconfig.postUserPing
});

export function quickApplyRegistration(
  url,
  postObj,
  resolve,
  reject,
  isQuickApply
) {
  return {
    type: `${APP_EVENT.QUICK_APPLY_REGISTRATION}_WATCHER`,
    action_type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    data: postObj,
    url,
    resolve,
    reject,
    isQuickApply
  };
}

export function postUpdateUserProfile(data, resolve, reject) {
  const url = getUrl(Urlconfig.postUpdateUserProfile);
  return {
    type: `${APP_EVENT.POST_UPDATE_USER_PROFILE}_WATCHER`,
    action_type: `${APP_EVENT.POST_UPDATE_USER_PROFILE}_EFFECT`,
    data,
    url,
    resolve,
    reject
  };
}
export function isUserRegistered(url, resolve, reject) {
  return {
    type: `${APP_EVENT.IS_USER_REGISTERED}_WATCHER`,
    action_type: `${APP_EVENT.IS_USER_REGISTERED}_EFFECT`,
    url,
    resolve,
    reject
  };
}
export function forceRecommend(resolve, reject, url) {
  url = url || getUrl(Urlconfig.forceRecommend);
  return {
    type: `${APP_EVENT.FORCE_RECOMMEND}_WATCHER`,
    action_type: `${APP_EVENT.FORCE_RECOMMEND}_EFFECT`,
    url,
    resolve,
    reject
  };
}
export function userVerify(url, resolve, reject, pageName, props) {
  return {
    type: `${APP_EVENT.USER_VERIFY}_WATCHER`,
    action_type: `${APP_EVENT.USER_VERIFY}_EFFECT`,
    url,
    resolve,
    reject,
    pageName,
    props
  };
}
export function isUserRegisteredUserVerify(data, props) {
  return {
    type: `${APP_EVENT.IS_USER_REGISTERED_USER_VERIFY}_WATCHER`,
    action_type: `${APP_EVENT.IS_USER_REGISTERED_USER_VERIFY}_EFFECT`,
    data,
    props
  };
}
export function userVerifyForceRecommend(data, props) {
  return {
    type: `${APP_EVENT.USER_VERIFY_FORCE_RECOMMEND}_WATCHER`,
    action_type: `${APP_EVENT.USER_VERIFY_FORCE_RECOMMEND}_EFFECT`,
    data,
    props
  };
}
export function forceRecommendGetJobDetails(data, props) {
  return {
    type: `${APP_EVENT.FORCE_RECOMMEND_GET_JOB_DETAILS}_WATCHER`,
    action_type: `${APP_EVENT.FORCE_RECOMMEND_GET_JOB_DETAILS}_EFFECT`,
    data,
    props
  };
}
export function deleteUserDetailsData() {
  return {
    type: `${APP_EVENT.DELETE_USER_DETAILS_DATA}_WATCHER`
  };
}

export function getUserBasicDetails(url) {
  return {
    type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_WATCHER`,
    action_type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`,
    url
  };
}
export function handlepublicJDApply(resolve, reject, showWarning, jobId = "") {
  return {
    type: `${APP_EVENT.HANDLE_LAZY_LOGIN_JD_APPLY}_WATCHER`,
    action_type: `${APP_EVENT.HANDLE_LAZY_LOGIN_JD_APPLY}_EFFECT`,
    resolve,
    reject,
    showWarning,
    jobId
  };
}
export function validateOTP({
  url,
  data,
  resolve,
  reject,
  isScreenConfigRequired
}) {
  return {
    type: `${APP_EVENT.VALIDATE_OTP}_WATCHER`,
    action_type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    url,
    data,
    resolve,
    reject,
    isScreenConfigRequired
  };
}
export function forceRecommendAndApply(resolve, reject, url) {
  return {
    type: `${APP_EVENT.FORCE_RECOMMEND_AND_APPLY}_WATCHER`,
    action_type: `${APP_EVENT.FORCE_RECOMMEND_AND_APPLY}_EFFECT`,
    url,
    resolve,
    reject
  };
}
export function setStatusNavRoute(data) {
  return {
    type: `${APP_EVENT.SET_STATUS_NAV_ROUTE}_WATCHER`,
    action_type: `${APP_EVENT.SET_STATUS_NAV_ROUTE}_EFFECT`,
    data
  };
}
export function setAccessToken(data) {
  return {
    type: `${APP_EVENT.SET_ACCESS_TOKEN}_WATCHER`,
    action_type: `${APP_EVENT.SET_ACCESS_TOKEN}_EFFECT`,
    data
  };
}
export function emptyState() {
  return {
    type: `${APP_EVENT.EMPTY_STATE}_WATCHER`,
    action_type: `${APP_EVENT.EMPTY_STATE}_EFFECT`
  };
}
export function whatsappOptin() {
  return {
    type: `${APP_EVENT.WHATSAPP_OPT_IN}_WATCHER`,
    action_type: `${APP_EVENT.WHATSAPP_OPT_IN}_EFFECT`
  };
}
export function showWhatsappOptIn(data, isJobApplied, trackerCat) {
  return {
    type: `${APP_EVENT.SET_WHATSAPP_OPT_IN}_WATCHER`,
    action_type: `${APP_EVENT.SET_WHATSAPP_OPT_IN}_EFFECT`,
    data,
    isJobApplied,
    trackerCat
  };
}
// export function getLinkedInAuth() {
//   const client_id = "815tm15suvrghh";
//   const redirect_uri = window.location.href;
//   const scope = "r_liteprofile r_emailaddress w_member_social";
//   const codeUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&state=fdsf78fyds7fm&scope=${scope}`;
//   window.open(codeUrl, "_self");
// }
// export function getLinkedInAuthCode(postObj) {
//   return {
//     type: `${APP_EVENT.GET_LINKEDIN_CODE}_WATCHER`,
//     action_type: `${APP_EVENT.GET_LINKEDIN_CODE}_EFFECT`,
//     postObj
//   };
// }

export function getPrefetchSuggestors(
  currentTime,
  lastUpdatedTime = 0,
  resolve = () => {},
  reject = () => {}
) {
  return {
    type: `${APP_EVENT.GET_PREFETCH_SUGGESTORS}_WATCHER`,
    action_type: `${APP_EVENT.GET_PREFETCH_SUGGESTORS}_EFFECT`,
    currentTime,
    lastUpdatedTime,
    resolve,
    reject
  };
}

export function getNotifications(userId) {
  const url = Urlconfig.getLandingLogo
  const query = {
    "query":`{ getUserActionHistory(userId: "${userId}"){assessmentPending{jobId,contestId,companyId,companyName,jobTitle} ,assessmentPassed{jobId,contestId,companyId,companyName,jobTitle}, ,assessmentFailed{jobId,contestId,companyId,companyName,jobTitle} ,interviewPending{jobId,contestId,companyId,companyName,jobTitle}  } }`
  }
  return {
    type: `${APP_EVENT.GET_USER_NOTIFICATIONS}_WATCHER`,
    action_type: `${APP_EVENT.GET_USER_NOTIFICATIONS}_EFFECT`,
    payload: query,
    url
  };
}
