import { put, takeEvery, call } from "redux-saga/effects";

import APP_EVENT from "../AppEvents";

import services from "../../../../utils/services";

export function* resendOTP(action) {
  const { url, data, resolve, reject } = action;
  try {
    const result = yield call(services.post, url, data);
    if (result.status < 300) {
      yield call(resolve, result.data);
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
export function* setInteractionId(action) {
  const { data, action_type } = action;
  yield put({
    type: action_type,
    payload: data
  });
}
export default function* otpPageWatcherSaga() {
  yield takeEvery(`${APP_EVENT.RESEND_OTP}_WATCHER`, resendOTP);
  yield takeEvery(`${APP_EVENT.SET_INTERACTION_ID}_WATCHER`, setInteractionId);
}
