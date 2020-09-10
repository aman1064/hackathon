import keymirror from "keymirror";

const APP_EVENTS = keymirror({
  GET_RECOMMENDED_JOBS: null,
  GET_JOB_DETAILS: null,
  SET_JOBID: null,
  GET_VIEWED_JOBS: null,
  GET_SAVED_JOBS: null,
  SET_BOOKMARK: null,
  DELETE_BOOKMARK: null,
  REMOVE_JOB: null,
  GET_IRRELEVANT_REASONS: null,
  POST_VIEWED_JOB: null,
  POST_APPLY_JOB: null,
  SET_ACTIVE_SWIPE_JOB_INDEX: null,
  GET_CV_UPLOAD_SCREEN_CONFIG: null,
  GET_RECOMMENDED_JOBS_POST_VIEW: null
});

export default APP_EVENTS;
