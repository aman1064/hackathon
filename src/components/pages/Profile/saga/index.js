import { put, call, takeEvery } from "redux-saga/effects";

import APP_EVENT from "../AppEvents";

import services from "../../../../utils/services";
import appConstants from "../../../../constants/appConstants";
import Store from "../../../../store/Store";

export function* getBasicUserDetails(action) {
  const { url, action_type } = action;
  try {
    const { data } = yield call(services.get, url);
    yield put({
      type: action_type,
      payload: data
    });
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}
export function* getUserProfile(action) {
  const { url, action_type, resolve, reject } = action;
  try {
    const result = yield call(services.get, url);
    if (result.status === 200) {
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
// export function* getPositionData(action) {
//   const { url, action_type } = action;
//   try {
//     const { data } = yield call(services.get, url);
//     yield put({
//       type: action_type,
//       payload: data
//     });
//   } catch (error) {
//     yield put({
//       type: "Fetch_Error",
//       payload: error
//     });
//   }
// }
export function* getJobRoleData(action) {
  const { url, action_type } = action;
  try {
    const { data } = yield call(services.get, url);
    yield put({
      type: action_type,
      payload: data
    });
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* updateCurrentScreenWithPromise(action) {
  const { data, action_type, resolve, reject } = action;
  //added string check to ensure cv upload screen gets rendered
  if (typeof data === "string" && !appConstants.APLHANUMERIC_REGEX.test(data)) {
    const {
      registrationData: { screens }
    } = Store.getState();
    let id;
    Object.values(screens).forEach(function(obj) {
      if (obj.name === data) {
        id = obj.id;
      }
    });

    yield put({
      type: action_type,
      payload: id
    });
    if (resolve) {
      yield call(resolve, id);
    }

    // if (reject) {
    //   yield call(reject, "Screen not found");
    // }
  } else {
    yield put({
      type: action_type,
      payload: data
    });
    yield call(resolve, data);
  }
}
export function* getProfileEditScreens(action) {
  const { url, action_type, prevValue, resolve } = action;

  try {
    if (prevValue) {
      yield put({
        type: action_type,
        payload: prevValue
      });
    } else {
      const { data } = yield call(services.post, url);
      yield put({
        type: action_type,
        payload: data
      });
      yield call(resolve, data);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export default function* profileWatcherSaga() {
  yield takeEvery(
    `${APP_EVENT.GET_BASIC_USER_DETAILS}_WATCHER`,
    getBasicUserDetails
  );
  yield takeEvery(`${APP_EVENT.GET_USER_PROFILE}_WATCHER`, getUserProfile);
  //yield takeEvery(`${APP_EVENT.GET_POSITION_DATA}_WATCHER`, getPositionData);
  yield takeEvery(`${APP_EVENT.GET_JOB_ROLE_DATA}_WATCHER`, getJobRoleData);
  yield takeEvery(
    `${APP_EVENT.UPDATE_CURRENT_SCREEN_WITH_PROMISE}_WATCHER`,
    updateCurrentScreenWithPromise
  );
  yield takeEvery(
    `${APP_EVENT.GET_PROFILE_EDIT_SCREENS}_WATCHER`,
    getProfileEditScreens
  );
}
