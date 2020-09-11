import { put, takeEvery, call, take, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import APP_EVENT from "../AppEvents";
import services from "../utils/services";
import Urlconfig from "../constants/Urlconfig";
import { getUrl } from "../utils/getUrl";
import routeConfig from "../constants/routeConfig";
import store from "../store/Store";
import { trackCleverTap } from "../utils/tracking";
import getSessionStorage from "../utils/getSessionStorage";
import { setCookie } from "../utils/Cookie";
import get from "../utils/jsUtils/get";
import updatePrefetchSuggestorData from "../utils/prefetchSuggestorUtils";

function* responseHandler(result, resolve, reject) {
  if (result.status >= 200 && result.status < 300) {
    yield call(resolve, result);
  } else {
    yield call(reject, result);
  }
}
function* actionDispatcher(action) {
  const { action_type, data } = action;
  yield put({
    type: action_type,
    payload: data
  });
}
function getUserDetails(result) {
  localStorage.setItem(
    "profile",
    JSON.stringify(result.data.profile || result.data.profileV2)
  );
  const profile = getStructuredProfile(
    result.data.profile || result.data.profileV2
  );

  return {
    accessToken: result.data.accessToken,
    mobileNumberExists: result.data.mobileNumberExists,
    mobileNumberVerified: result.data.mobileNumberVerified,
    profile,
    name: (result.data.userDetails && result.data.userDetails.name) || ""
  };
}

function getStructuredProfile(profile) {
  const keysToStructure = {
    latestCompanyDetails: ["location", "company"],
    latestEducationDetails: ["course", "courseDepartment", "college"]
  };
  const structuredProfile = { ...profile };

  for (const key in keysToStructure) {
    if (get(profile, key)) {
      for (let i = 0; i < keysToStructure[key].length; i++) {
        if (get(profile, `${key}.${keysToStructure[key][i]}`)) {
          structuredProfile[key][keysToStructure[key][i]].id =
            get(profile, `${key}.${keysToStructure[key][i]}.id`) || null;
        }
      }
    }
  }
  return structuredProfile;
}

function pushProfileInCleverTap() {
  const formState = store.getState();
  const commonData = formState.commonData;
  const userBasicDetails = commonData.userBasicDetails;
  if (userBasicDetails && userBasicDetails.name) {
    trackCleverTap("profile", {
      Name: userBasicDetails.name,
      Identity: userBasicDetails.id,
      Email: userBasicDetails.email
    });
  }
}

export function* setAccessToken(action) {
  const res = actionDispatcher(action);
  yield res.next().value;
}

export function* handlepublicJDApply(action) {
  const { resolve, reject, showWarning, jobId } = action;
  const publicJobDetails = getSessionStorage("publicJobDetails") || { jobId };
  const forceRecommendAndApply = getUrl(
    Urlconfig.applyModeration.replace("{jobId}", publicJobDetails.jobId) +
      "?public=true"
  );
  const result = yield call(services.post, forceRecommendAndApply, {
    apiLabel: "Force Recommend and Apply"
  });
  if (result.status >= 200 && result.status < 300) {
    if (result.data && !result.data.processed && showWarning) {
      sessionStorage.setItem("showPublicJdWarning", "true");
      yield call(openCloseGlobalPrompt, {
        action_type: `${APP_EVENT.OPEN_GLOBAL_PROMPT}_EFFECT`,
        data: {
          isOpen: true,
          msg: "Application sent to recruiter!",
          variant: "warning",
          info: "Note: Your profile is a low match for this job",
          icon: "Warning",
          messageClass: "bold"
        }
      });
    }
    yield call(resolve, result);
  } else {
    yield call(reject, result);
  }
}
export function* socialLogin(action) {
  const { action_type, data, reject, resolve, url, pageName } = action;
  try {
    // if (pageName && pageName === "signup") {
    //   trackCleverTap(
    //     "profile",
    //     {
    //       utm_source: sessionStorage.getItem("utm_source"),
    //       utm_campaign: sessionStorage.getItem("utm_campaign"),
    //       utm_medium: sessionStorage.getItem("utm_medium"),
    //       source: sessionStorage.getItem("source")
    //     },
    //     true
    //   );
    // }
    let result = yield call(services.post, url, data);
    if (result.status >= 200 && result.status < 300) {
      // its only for version 1(v1) login api
      yield call(setAccessToken, {
        data: result.data.accessToken,
        action_type: `${APP_EVENT.SET_ACCESS_TOKEN}_EFFECT`
      });
      const getUserProfileUrl = getUrl(
        Urlconfig.getUserProfile.replace("{profileId}", result.data.profile.id)
      );
      const userProfileData = yield call(services.get, getUserProfileUrl);
      if (userProfileData.status >= 200 && userProfileData.status < 300) {
        result = {
          data: {
            accessToken: result.data.accessToken,
            mobileNumberExists: result.data.mobileNumberExists,
            mobileNumberVerified: result.data.mobileNumberVerified,
            userDetails: result.data.userDetails,
            profile: userProfileData.data
          }
        };
      }
      // end of v1 login api integration
      const user = getUserDetails(result);
      yield put({
        type: action_type,
        payload: user
      });
      yield call(getUserBasicDetails, {
        url: Urlconfig.getUserBasicDetails,
        action_type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`
      });
      const publicJobDetails = getSessionStorage("publicJobDetails");
      if (
        publicJobDetails &&
        Object.keys(publicJobDetails) &&
        user.profile.isUserProfileCompleted
      ) {
        if (user.profile.fileName) {
          yield call(handlepublicJDApply, {});
          yield call(openCloseGlobalPrompt, {
            action_type: `${APP_EVENT.OPEN_GLOBAL_PROMPT}_EFFECT`,
            data: {
              isOpen: true,
              variant: "success",
              msg: "Application sent to recruiter successfully"
            }
          });
        } else {
          const getJobDetailsUrl = getUrl(
            Urlconfig.jobDetails.replace("{jobId}", publicJobDetails.jobId)
          );
          const jobData = yield call(services.get, getJobDetailsUrl);
          yield call(resolve, jobData);
        }
      }
      const formState = store.getState();
      const commonData = formState.commonData;
      const userBasicDetails = commonData.userBasicDetails;
      if (userBasicDetails && userBasicDetails.name) {
        trackCleverTap("profile", {
          Name: userBasicDetails.name,
          Identity: userBasicDetails.id,
          Email: userBasicDetails.email
        });
      }
      if (!user.profile.isUserProfileCompleted || !user.mobileNumberVerified) {
        const screens = yield call(
          services.post,
          Urlconfig.registrationScreenConfig,
          { userId: user.profile.userId }
        );
        const result = {
          user,
          screens
        };
        yield call(resolve, result);
      } else {
        result = {
          user,
          screens: []
        };
        yield call(resolve, result);
      }
    } else {
      yield call(reject, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* userLogin(action) {
  const { data, reject, resolve, url, pageName } = action;
  try {
    const result = yield call(services.post, url, data);
    const res = responseHandler(result, resolve, reject);
    yield res.next().value;
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* validateOTP(action) {
  const {
    url,
    data,
    resolve,
    reject,
    action_type,
    isScreenConfigRequired = true
  } = action;
  try {
    let user;
    let result = yield call(services.post, url, {
      ...data,
      apiLabel: "Validate Otp"
    });
    if (result.status < 300) {
      const formState = store.getState();
      const commonData = formState.commonData;
      const userDetails = commonData.userDetails;
      // specific condition for socail login
      if (userDetails && userDetails.accessToken && !result.data.accessToken) {
        userDetails.mobileNumberExists = true;
        userDetails.mobileNumberVerified = true;
        user = userDetails;
      } else {
        user = getUserDetails(result);
        yield call(setAccessToken, {
          data: result.data.accessToken,
          action_type: `${APP_EVENT.SET_ACCESS_TOKEN}_EFFECT`
        });
        yield call(getUserBasicDetails, {
          url: Urlconfig.getUserBasicDetails,
          action_type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`
        });
        pushProfileInCleverTap();
      }
      yield put({
        type: action_type,
        payload: user
      });
      if (
        (!user.profile.isUserProfileCompleted || !user.mobileNumberVerified) &&
        isScreenConfigRequired
      ) {
        const screens = yield call(
          services.post,
          Urlconfig.registrationScreenConfig,
          { userId: user.profile.userId }
        );
        result = {
          user,
          screens
        };
      } else {
        result = {
          user,
          screens: []
        };
      }
      yield call(resolve, result);
    } else {
      yield call(reject, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* userRegistration(action) {
  const { data, reject, resolve } = action;

  try {
    const result = yield call(services.post, Urlconfig.signup, data);
    const res = responseHandler(result, resolve, reject);
    yield res.next().value;
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* openCloseGlobalPrompt(action) {
  const res = actionDispatcher(action);
  yield res.next().value;
}

export function* updateUserProfile(action) {
  const res = actionDispatcher(action);
  yield res.next().value;
}

export function* userLogout(action) {
  const { action_type, url } = action;
  try {
    yield call(services.post, url);
    yield put({
      type: action_type
    });
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* setJobId(action) {
  const { jobId, action_type, resolve } = action;
  yield put({
    type: action_type,
    payload: jobId
  });
  yield call(resolve, "success");
}

export function* setMobileNumberExists(action) {
  const res = actionDispatcher(action);
  yield res.next().value;
}
export function* postUserPing(action) {
  const { url } = action;
  try {
    const result = yield call(services.post, url);
    if (result.status >= 300) {
      localStorage.removeItem("userPingStartTime");
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* forceRecommendAndApply(action) {
  const { resolve, reject } = action;
  let { url } = action;

  url = url || getUrl(Urlconfig.forceRecommendAndApply);
  try {
    const result = yield call(services.post, url, {});
    const res = responseHandler(result, resolve, reject);
    yield res.next().value;
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* quickApplyRegistration(action) {
  const { url, data, resolve, reject } = action;
  try {
    const result = yield call(services.post, url, data);
    const res = responseHandler(result, resolve, reject);
    yield res.next().value;
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* postUpdateUserProfile(action) {
  const { url, data, resolve } = action;
  try {
    const result = yield call(services.post, url, data);
    if (result.status >= 200 && result.status < 300) {
      yield call(resolve, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* isUserRegistered(action) {
  const { url, resolve, action_type } = action;
  try {
    const result = yield call(services.get, url);

    if (result.status >= 200 && result.status < 300) {
      yield put({
        type: action_type,
        payload: result.data
      });
      yield call(resolve, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: "error"
    });
  }
}

export function* forceRecommend(action) {
  const { url, resolve, reject, action_type } = action;
  try {
    const result = yield call(services.post, url, {});
    if (result.status >= 200 && result.status < 300) {
      yield put({
        type: action_type,
        payload: true
      });
      yield call(resolve, result);
    } else {
      yield call(reject, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* deleteUserDetailsData() {
  const commonData = {
    data: {
      accessToken: "",
      profile: {}
    }
  };
  yield put({
    type: `${APP_EVENT.USER_DETAILS}_EFFECT`,
    payload: getUserDetails(commonData)
  });
  yield put({
    type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`,
    payload: {}
  });
}
export function* userVerify(action) {
  const { url, resolve, reject, action_type, pageName, props } = action;
  try {
    const result = yield call(services.post, url, {});
    if (result.status >= 200 && result.status < 300) {
      if (!result.data && pageName === "login") {
        sessionStorage.removeItem("isQuickApplyFlow");
        sessionStorage.removeItem("isNewMail");
        props.history.push(routeConfig.jobs);
      } else if (!result.data) {
        yield call(deleteUserDetailsData);
      }
      yield put({
        type: action_type,
        payload: result.data
      });
      yield call(resolve, result);
    } else {
      yield call(reject, result);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* isUserRegisteredUserVerify(action) {
  const { data, props } = action;
  const { accessToken, viewJobFromMailer, id, landingRoute } = data;
  const { payload } = yield take(`${APP_EVENT.IS_USER_REGISTERED}_EFFECT`);
  if (payload === true && accessToken) {
    sessionStorage.setItem("isUserRegistered", "1");
    const url = `${Urlconfig.userVerify}?id=${id}`;
    yield call(userVerify, {
      url,
      action_type: `${APP_EVENT.USER_VERIFY}_EFFECT`
    });
  } else if (payload === true) {
    sessionStorage.setItem("isUserRegistered", "1");
    props.history.push(routeConfig.login, {
      viewJobFromMailer
    });
  } else {
    sessionStorage.setItem("isUserRegistered", "2");
    setCookie("isProfileVisibility", false);
    /* this is done for the scenario in case of quick apply
      if a user is already logged in and then another user attempts to create profile
      via quick apply */
    props.history.push({
      pathname: landingRoute
    });
  }
}
export function* userVerifyForceRecommend(action) {
  const { props, data } = action;
  const { payload } = yield take(`${APP_EVENT.USER_VERIFY}_EFFECT`);
  if (payload === true) {
    const url = getUrl(Urlconfig.forceRecommend.replace("{jobId}", data.jobId));
    yield call(forceRecommend, {
      url,
      action_type: `${APP_EVENT.FORCE_RECOMMEND}_EFFECT`
    });
  } else {
    props.history.push(routeConfig.login);
  }
}
export function* forceRecommendGetJobDetails(action) {
  const { data, props } = action;
  const { viewJobFromMailer, jobId } = data;
  const { payload } = yield take(`${APP_EVENT.FORCE_RECOMMEND}_EFFECT`);

  if (payload === true) {
    if (viewJobFromMailer) {
      props.history.push(routeConfig.jobs);
    } else {
      let url = Urlconfig.jobDetails;
      url = url.replace("{jobId}", jobId);
      url = getUrl(url);
      yield call(props.getJobDetails, null, null, url);
      props.history.push({
        pathname: routeConfig.jobs,
        search: `?jobId=${jobId}`
      });
    }
  }
}

export function* getUserBasicDetails({ action_type, url }) {
  yield call(delay, 500);
  const { data } = yield call(services.get, url);
  yield put({
    type: action_type,
    payload: data
  });
}
export function* setStatusNavRoute(action) {
  const res = actionDispatcher(action);
  yield res.next().value;
}
export function* emptyState(action) {
  const { action_type } = action;
  yield put({
    type: action_type
  });
}
export function* whatsappOptIn({ action_type }) {
  const { data } = yield call(services.post, Urlconfig.whatsappSubscribe);
  yield call(openCloseGlobalPrompt, {
    action_type: `${APP_EVENT.OPEN_GLOBAL_PROMPT}_EFFECT`,
    data: {
      isOpen: true,
      msg: "You have successfully subscribed to our WhatsApp channel",
      variant: "success"
    }
  });
  yield put({
    type: action_type,
    payload: data
  });
}
export function* showWhatsappOptIn({
  action_type,
  data,
  isJobApplied = false,
  trackerCat = "browse"
}) {
  yield put({
    type: action_type,
    payload: { data, isJobApplied, trackerCat }
  });
  yield call(getUserBasicDetails, {
    url: Urlconfig.getUserBasicDetails,
    action_type: `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`
  });
}

export function* getPrefetchSuggestors({
  currentTime,
  lastUpdatedTime,
  action_type,
  resolve,
  reject
}) {
  const url = getUrl(Urlconfig.getAllSuggestorsByTime).replace(
    "{lastUpdatedTime}",
    lastUpdatedTime
  );
  const {
    commonData: { suggestors }
  } = store.getState();
  let _suggestors = suggestors;
  if (!_suggestors) {
    _suggestors = {
      company: [],
      location: []
    };
  }
  const result = yield call(services.get, url);
  if (result.status >= 200 && result.status < 300) {
    let sortedCompanies, sortedLocations;
    if (
      result.data &&
      Object.prototype.hasOwnProperty.call(result.data, "location")
    ) {
      sortedLocations = updatePrefetchSuggestorData(
        _suggestors.location,
        result.data.location,
        "weight",
        "textData"
      );
    } else {
      sortedLocations = _suggestors.location;
    }
    if (
      result.data &&
      Object.prototype.hasOwnProperty.call(result.data, "company")
    ) {
      sortedCompanies = updatePrefetchSuggestorData(
        _suggestors.company,
        result.data.company,
        "weight",
        "textData"
      );
    } else {
      sortedCompanies = _suggestors.company;
    }

    yield put({
      type: action_type,
      payload: {
        data: { location: sortedLocations, company: sortedCompanies },
        currentTime
      }
    });
    yield call(resolve, result);
  } else {
    yield call(reject, result);
  }
}

export function* getNotifications(action) {
  const {url, payload, action_type} = action
  try {
    const { data } = yield call(services.post, url, payload);
    if(data) {
      yield put({type: action_type, payload: data.getUserActionHistory})
    }
  } catch (error) {
    console.log(error)
  }

}

export default function* commonWatcherSaga() {
  yield takeEvery(`${APP_EVENT.USER_LOGIN}_WATCHER`, userLogin);
  yield takeEvery(`${APP_EVENT.SOCIAL_LOGIN}_WATCHER`, socialLogin);
  yield takeEvery(`${APP_EVENT.USER_REGISTRATION}_WATCHER`, userRegistration);
  yield takeEvery(
    `${APP_EVENT.OPEN_GLOBAL_PROMPT}_WATCHER`,
    openCloseGlobalPrompt
  );
  yield takeEvery(
    `${APP_EVENT.CLOSE_GLOBAL_PROMPT}_WATCHER`,
    openCloseGlobalPrompt
  );
  yield takeEvery(
    `${APP_EVENT.UPDATE_USER_PROFILE}_WATCHER`,
    updateUserProfile
  );
  yield takeEvery(`${APP_EVENT.USER_LOGOUT}_WATCHER`, userLogout);
  yield takeEvery(`${APP_EVENT.SET_JOBID}_WATCHER`, setJobId);
  yield takeEvery(
    `${APP_EVENT.SET_MOBILE_NUMBER_EXISTS}_WATCHER`,
    setMobileNumberExists
  );
  yield takeEvery(`${APP_EVENT.POST_USER_PING}_WATCHER`, postUserPing);
  yield takeEvery(
    `${APP_EVENT.QUICK_APPLY_REGISTRATION}_WATCHER`,
    quickApplyRegistration
  );
  yield takeEvery(
    `${APP_EVENT.POST_UPDATE_USER_PROFILE}_WATCHER`,
    postUpdateUserProfile
  );
  yield takeEvery(`${APP_EVENT.IS_USER_REGISTERED}_WATCHER`, isUserRegistered);
  yield takeEvery(`${APP_EVENT.FORCE_RECOMMEND}_WATCHER`, forceRecommend);
  yield takeEvery(`${APP_EVENT.USER_VERIFY}_WATCHER`, userVerify);
  yield takeEvery(
    `${APP_EVENT.IS_USER_REGISTERED_USER_VERIFY}_WATCHER`,
    isUserRegisteredUserVerify
  );
  yield takeEvery(
    `${APP_EVENT.USER_VERIFY_FORCE_RECOMMEND}_WATCHER`,
    userVerifyForceRecommend
  );
  yield takeEvery(
    `${APP_EVENT.FORCE_RECOMMEND_GET_JOB_DETAILS}_WATCHER`,
    forceRecommendGetJobDetails
  );
  yield takeEvery(
    `${APP_EVENT.DELETE_USER_DETAILS_DATA}_WATCHER`,
    deleteUserDetailsData
  );
  yield takeLatest(
    `${APP_EVENT.GET_USER_BASIC_DETAILS}_WATCHER`,
    getUserBasicDetails
  );
  yield takeEvery(
    `${APP_EVENT.HANDLE_LAZY_LOGIN_JD_APPLY}_WATCHER`,
    handlepublicJDApply
  );
  yield takeEvery(`${APP_EVENT.VALIDATE_OTP}_WATCHER`, validateOTP);
  yield takeEvery(
    `${APP_EVENT.FORCE_RECOMMEND_AND_APPLY}_WATCHER`,
    forceRecommendAndApply
  );
  yield takeEvery(
    `${APP_EVENT.SET_STATUS_NAV_ROUTE}_WATCHER`,
    setStatusNavRoute
  );
  yield takeEvery(`${APP_EVENT.SET_ACCESS_TOKEN}_WATCHER`, setAccessToken);
  yield takeEvery(`${APP_EVENT.EMPTY_STATE}_WATCHER`, emptyState);
  yield takeEvery(`${APP_EVENT.WHATSAPP_OPT_IN}_WATCHER`, whatsappOptIn);
  yield takeEvery(
    `${APP_EVENT.SET_WHATSAPP_OPT_IN}_WATCHER`,
    showWhatsappOptIn
  );
  yield takeEvery(
    `${APP_EVENT.GET_PREFETCH_SUGGESTORS}_WATCHER`,
    getPrefetchSuggestors
  );
  yield takeEvery(
    `${APP_EVENT.GET_USER_NOTIFICATIONS}_WATCHER`,
      getNotifications
  );
}
