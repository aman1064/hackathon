import { put, call, takeEvery } from "redux-saga/effects";
import APP_EVENT from "../AppEvents";
import services from "../../../../../../utils/services";

export function* submitQuestion(action) {
  const { url, action_type, payload, resolve } = action;
  try {
    const result = yield call(services.post, url, payload);
    if (result.status === 200) {
      const { data } = result;
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

export function* resetSubmitting(action) {
  const { action_type } = action;
  try {
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

export default function* contestQAWatcher() {
  yield takeEvery(
    [
      `${APP_EVENT.START_CONTEST_QUEST}_WATCHER`,
      `${APP_EVENT.SUBMIT_CONTEST_QUEST}_WATCHER`
    ],
    submitQuestion
  );
  yield takeEvery(`${APP_EVENT.RESET_SUBMITTING}_WATCHER`, resetSubmitting);
}
