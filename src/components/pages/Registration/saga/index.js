import { put, takeEvery, call, take } from "redux-saga/effects";

import services from "../../../../utils/services";
import APP_EVENT from "../AppEvents";
import Urlconfig from "../../../../constants/Urlconfig";
import CommonAppEvent from "../../../../AppEvents";
import { getUrl } from "../../../../utils/getUrl";
import getSessionStorage from "../../../../utils/getSessionStorage";
import Store from "../../../../store/Store";
import tracker from "../../../../analytics/tracker";

export function* getRegistrationScreensData(action) {
  const { action_type, url, profile, resolve } = action;

  const userId = profile.userId;
  try {
    const { data } = yield call(services.post, url, { userId }),
      resultObj = Object.assign({}, data);
    resultObj.screens = data.screens;
    resultObj.currentScreen = data.screens[data.defaultFlow[0]];
    resultObj.firstScreenId = data.defaultFlow[0];
    yield put({
      type: action_type,
      payload: resultObj
    });
    yield resolve(resultObj);
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* postCompletedProfile(action) {
  const { url, resolve, reject, trackerData = {} } = action;
  try {
    const updatedProfile = yield call(services.post, url, {
      isUserProfileCompleted: true
    });
    if (updatedProfile.status >= 200 && updatedProfile.status < 300) {
      yield put({
        type: `${CommonAppEvent.UPDATE_USER_PROFILE}_EFFECT`,
        payload: updatedProfile.data
      });

      tracker().on("ctapEvent", {
        hitName: "profile_complete",
        payload: {
          flow:
            trackerData && trackerData.flow
              ? trackerData.flow
              : getSessionStorage("isQuickApply")
              ? "quick_apply_flow"
              : "product_flow"
        }
      });
      tracker().on("ctapProfile", {
        hitName: "profile_complete",
        payload: {
          is_profile_complete: true,
          does_cv_exist: true,
          updated_by: trackerData.updated_by
        }
      });

      yield call(resolve, updatedProfile.data);
    } else {
      yield call(reject, updatedProfile);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* getNextRegistrationScreen(action) {
  const { action_type, url, data, resolve, reject, isEdit } = action;
  try {
    const result = yield call(services.post, url, data.profile);
    const {
      registrationData: { defaultFlow }
    } = Store.getState();
    const nextScreenId =
      defaultFlow[defaultFlow.indexOf(data.currentScreenId) + 1];

    if (result.status >= 200 && result.status < 300) {
      if (isEdit) {
        sessionStorage.setItem("isUpdated", true);
        yield call(resolve, nextScreenId);
      } else if (nextScreenId) {
        yield put({
          type: action_type,
          payload: {
            previousScreen: data.currentScreenId,
            currentScreen: nextScreenId
          }
        });
        yield call(resolve, nextScreenId);
      } else {
        const url = getUrl(Urlconfig.postCompletedProfile);
        localStorage.removeItem("domainRoleMap"); // to remove mapping at the time of registration
        yield call(postCompletedProfile, {
          url,
          resolve
        });
        yield take(`${CommonAppEvent.UPDATE_USER_PROFILE}_EFFECT`);
        //yield call(resolve,"profilecompleted");
      }
    } else {
      yield call(reject, "apifailure");
    }
  } catch (e) {
    yield call(reject, e);
  }
}

export function* getPrevRegistrationScreen(action) {
  const { action_type, data, resolve } = action;
  yield put({
    type: action_type,
    payload: data
  });
  yield call(resolve, data);
}

export function* postUpdateUserDetails(action) {
  const { url, postObj, resolve, reject } = action;

  try {
    const res = yield call(services.post, url, postObj);

    if (res.status === 200) {
      yield call(resolve, res);
    } else {
      yield call(reject, res);
    }
  } catch (e) {
    yield call(reject, e);
  }
}

export default function* registrationWatcherSaga() {
  yield takeEvery(
    `${APP_EVENT.GET_REGISTRATION_CONFIG}_WATCHER`,
    getRegistrationScreensData
  );
  yield takeEvery(
    `${APP_EVENT.GET_NEXT_SCREEN}_WATCHER`,
    getNextRegistrationScreen
  );
  yield takeEvery(
    `${APP_EVENT.GET_PREV_SCREEN}_WATCHER`,
    getPrevRegistrationScreen
  );
  yield takeEvery(
    `${APP_EVENT.POST_UPDATE_USER_DETAILS}_WATCHER`,
    postUpdateUserDetails
  );
  yield takeEvery(
    `${APP_EVENT.POST_COMPLETED_PROFILE}_WATCHER`,
    postCompletedProfile
  );
}
