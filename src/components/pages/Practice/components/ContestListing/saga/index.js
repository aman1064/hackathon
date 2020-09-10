import { put, call, takeEvery } from "redux-saga/effects";
import APP_EVENT from "../AppEvents";
import services from "../../../../../../utils/services";

export function* getContests(action) {
  const { url, action_type } = action;
  try {
    const result = yield call(services.get, url);
    if (result.status === 200) {
      const { data } = result;
      yield put({
        type: action_type,
        payload: data
      });
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* getAttemptedTests(action) {
  const { url, action_type } = action;
  try {
    const result = yield call(services.get, url);
    if (result.status === 200) {
      const { data } = result;
      yield put({
        type: action_type,
        payload: data
      });
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export default function* contestsWatcherSaga() {
  yield takeEvery(`${APP_EVENT.GET_CONTEST}_WATCHER`, getContests);
  yield takeEvery(
    `${APP_EVENT.GET_ATTEMPTED_CONTEST}_WATCHER`,
    getAttemptedTests
  );
}
