import { put, call, takeEvery } from "redux-saga/effects";
import APP_EVENT from "./AppEvents";
import services from "../../../../utils/services";

export function* getQuizList(action) {
  const { url, action_type } = action;
  yield put({
    type: APP_EVENT.QUIZ_LIST_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
  } else {
    yield put({
      type: APP_EVENT.QUIZ_LIST_ERROR,
      payload: "something went wrong"
    });
  }
}

export function* getQuizDetails(action) {
  const { url, action_type } = action;
  yield put({
    type: APP_EVENT.QUIZ_DETAILS_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
  } else {
    yield put({
      type: APP_EVENT.QUIZ_DETAILS_ERROR,
      payload: "something went wrong"
    });
  }
}

export function* getRecommendedJobsInQuiz(action) {
  const { url, action_type } = action;
  yield put({
    type: APP_EVENT.RECOMMENDED_JOBS_IN_QUIZ_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
  } else {
    yield put({
      type: APP_EVENT.RECOMMENDED_JOBS_IN_QUIZ_ERROR,
      payload: "something went wrong"
    });
  }
}

export function* getAttemptInsights(action) {
  const { url, action_type } = action;
  yield put({
    type: APP_EVENT.ATTEMPT_INSIGHTS_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
  } else {
    yield put({
      type: APP_EVENT.ATTEMPT_INSIGHTS_ERROR,
      payload: "something went wrong"
    });
  }
}

export function* getLeaderboardData(action) {
  const { url, action_type } = action;
  yield put({
    type: APP_EVENT.LEADERBOARD_DATA_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
  } else {
    yield put({
      type: APP_EVENT.LEADERBOARD_DATA_ERROR,
      payload: "something went wrong"
    });
  }
}

export function* getPerformanceData(action) {
  const { url, action_type, resolve } = action;
  yield put({
    type: APP_EVENT.PERFORMANCE_DATA_LOADING
  });
  const result = yield call(services.get, url);
  const { data, status } = result;
  if (status <= 300) {
    yield put({
      type: action_type,
      payload: { data }
    });
    if (data.length) {
      yield put({
        type: `${APP_EVENT.GET_ATTEMPT_INSIGHTS}_EFFECT`,
        payload: { data: data[0].scoreInsights }
      });
    }
    yield call(resolve, data);
  } else {
    yield put({
      type: APP_EVENT.PERFORMANCE_DATA_ERROR,
      payload: "something went wrong"
    });
  }
}

export default function* practiceWatcherSaga() {
  yield takeEvery(`${APP_EVENT.GET_QUIZ_LIST}_WATCHER`, getQuizList);
  yield takeEvery(`${APP_EVENT.GET_QUIZ_DETAILS}_WATCHER`, getQuizDetails);
  yield takeEvery(
    `${APP_EVENT.GET_RECOMMENDED_JOBS_IN_QUIZ}_WATCHER`,
    getRecommendedJobsInQuiz
  );
  yield takeEvery(
    `${APP_EVENT.GET_ATTEMPT_INSIGHTS}_WATCHER`,
    getAttemptInsights
  );
  yield takeEvery(
    `${APP_EVENT.GET_LEADERBOARD_DATA}_WATCHER`,
    getLeaderboardData
  );
  yield takeEvery(
    `${APP_EVENT.GET_PERFORMANCE_DATA}_WATCHER`,
    getPerformanceData
  );
}
