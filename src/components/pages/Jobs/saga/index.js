import { put, call, takeEvery, take, takeLatest } from "redux-saga/effects";

import APP_EVENT from "../AppEvents";

import services from "../../../../utils/services";

export function* getRecommendedJobs(action) {
  const { url, action_type, isFresh, resolve, reject } = action;
  const result = yield call(services.get, url);
  if (result.status === 200) {
    const { data } = result;
    const dataObj = {
      data,
      isFresh
    };
    yield put({
      type: action_type,
      payload: dataObj
    });
    if (resolve) {
      yield call(resolve, data);
    }
  } else if (reject) {
    yield call(reject, result);
  }
}
export function* getRecommendedJobsPostView(action) {
  const { payload } = yield take("POST_VIEWED_JOB_EFFECT");
  const myaction = { ...action };
  myaction.data = payload;
  yield call(getRecommendedJobs, myaction);
}

export function* getJobDetails(action) {
  const { api, action_type, resolve, reject } = action;
  try {
    const result = yield call(services.get, api, {
      apiLabel: "Get Job Details"
    });
    const { data } = result;
    if (result.status >= 200 && result.status < 300) {
      yield put({
        type: action_type,
        payload: data
      });
      yield call(resolve, data);
    } else {
      yield put({
        type: action_type,
        payload: {}
      });
      yield call(reject, result.message);
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* getViewedSavedJobs(action) {
  const { url, action_type, isNextPage, resolve } = action;
  try {
    const { data } = yield call(services.get, url);
    yield put({
      type: action_type,
      payload: { data, isNextPage }
    });
    yield call(resolve, data);
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* setBookmark(action) {
  const { url, action_type, jobId, jobRoute } = action;
  try {
    yield call(services.post, url);
    yield put({
      type: action_type,
      payload: {
        jobId,
        jobRoute
      }
    });
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* deleteBookmark(action) {
  const { url, action_type, jobId, jobRoute } = action;
  try {
    yield call(services.post, url);
    yield put({
      type: action_type,
      payload: {
        jobId,
        jobRoute
      }
    });
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* removeJob(action) {
  const {
    url,
    postObj,
    action_type,
    jobId,
    pageName,
    resolve,
    reject
  } = action;
  try {
    const result = yield call(services.post, url, postObj);
    if (result.status === 200) {
      yield put({
        type: action_type,
        payload: {
          jobId,
          pageName
        }
      });
      yield call(resolve, "Job marked not relevant and removed from list");
    } else {
      yield call(reject, "Error");
    }
  } catch (error) {
    yield put({
      type: "Fetch_Error",
      payload: error
    });
  }
}

export function* getIrrelevantReasons(action) {
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
export function* postViewedJob(action) {
  const { url, action_type } = action;
  try {
    const { data } = yield call(services.post, url);
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

export function* postApplyJob(action) {
  const { api, action_type, resolve, reject, jobId } = action;
  try {
    const result = yield call(services.post, api);
    yield put({
      type: action_type,
      payload: jobId
    });
    yield call(resolve, result);
  } catch (error) {
    yield call(reject, error);
  }
}

export function* setActiveSwipeJobIndex(action) {
  const { activeIndex, action_type } = action;
  yield put({
    type: action_type,
    payload: activeIndex
  });
}

export function* getCVUploadScreenConfig(action) {
  const { url, resolve, reject } = action;
  try {
    const result = yield call(services.get, url);
    yield call(resolve, result);
  } catch (error) {
    yield call(reject, error);
  }
}

export default function* jobsWatcherSaga() {
  yield takeEvery(
    `${APP_EVENT.GET_RECOMMENDED_JOBS}_WATCHER`,
    getRecommendedJobs
  );

  yield takeLatest(
    `${APP_EVENT.GET_RECOMMENDED_JOBS_POST_VIEW}_WATCHER`,
    getRecommendedJobsPostView
  );
  yield takeEvery(`${APP_EVENT.GET_VIEWED_JOBS}_WATCHER`, getViewedSavedJobs);
  yield takeEvery(`${APP_EVENT.GET_SAVED_JOBS}_WATCHER`, getViewedSavedJobs);
  yield takeEvery(`${APP_EVENT.SET_BOOKMARK}_WATCHER`, setBookmark);
  yield takeEvery(`${APP_EVENT.DELETE_BOOKMARK}_WATCHER`, deleteBookmark);
  yield takeEvery(`${APP_EVENT.REMOVE_JOB}_WATCHER`, removeJob);
  yield takeEvery(
    `${APP_EVENT.GET_IRRELEVANT_REASONS}_WATCHER`,
    getIrrelevantReasons
  );
  yield takeEvery(`${APP_EVENT.GET_JOB_DETAILS}_WATCHER`, getJobDetails);
  yield takeEvery(`${APP_EVENT.POST_VIEWED_JOB}_WATCHER`, postViewedJob);
  yield takeEvery(`${APP_EVENT.POST_APPLY_JOB}_WATCHER`, postApplyJob);
  yield takeEvery(
    `${APP_EVENT.SET_ACTIVE_SWIPE_JOB_INDEX}_WATCHER`,
    setActiveSwipeJobIndex
  );
  yield takeEvery(
    `${APP_EVENT.GET_CV_UPLOAD_SCREEN_CONFIG}_WATCHER`,
    getCVUploadScreenConfig
  );
}
