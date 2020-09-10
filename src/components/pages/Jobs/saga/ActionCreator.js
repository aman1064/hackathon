import Urlconfig from "../../../../constants/Urlconfig";
import APP_EVENT from "../AppEvents";
import { getUrl } from "../../../../utils/getUrl";
import store from "../../../../store/Store";
import { trackCleverTap } from "../../../../utils/tracking";
import tracker from "../../../../analytics/tracker";

let page = 0;

export function getRecommendedJobsPostView(skipItems) {
  const url = getUrl(Urlconfig.recommendedJobsPostView);
  const agentId = localStorage.getItem("agentId");
  return {
    type: agentId
      ? `${APP_EVENT.GET_RECOMMENDED_JOBS}_WATCHER`
      : `${APP_EVENT.GET_RECOMMENDED_JOBS_POST_VIEW}_WATCHER`,
    action_type: `${APP_EVENT.GET_RECOMMENDED_JOBS}_EFFECT`,
    url: `${url}?skip=${skipItems}&limit=10`
  };
}
export function getRecommendedJobs(isFresh, resolve, reject) {
  const isNewSession = !!isFresh;
  const url = getUrl(Urlconfig.recommendedJobs);
  const agentId = localStorage.getItem("agentId");
  page = isNewSession ? 0 : page + 1;

  return {
    type: `${APP_EVENT.GET_RECOMMENDED_JOBS}_WATCHER`,
    action_type: `${APP_EVENT.GET_RECOMMENDED_JOBS}_EFFECT`,
    url: agentId
      ? `${url}?page=${page}&size=10&isNewSession=${isNewSession}`
      : `${url}?page=0&size=10&isNewSession=${isNewSession}`,
    isFresh: isNewSession,
    resolve,
    reject
  };
}

export function getJobDetails(resolve, reject, url) {
  const api = url || getUrl(Urlconfig.jobDetails);
  return {
    type: `${APP_EVENT.GET_JOB_DETAILS}_WATCHER`,
    action_type: `${APP_EVENT.GET_JOB_DETAILS}_EFFECT`,
    api,
    resolve,
    reject
  };
}

export const getViewedJobs = (url, isNextPage, resolve = () => {}) => ({
  type: `${APP_EVENT.GET_VIEWED_JOBS}_WATCHER`,
  action_type: `${APP_EVENT.GET_VIEWED_JOBS}_EFFECT`,
  url,
  isNextPage,
  resolve
});

export const getSavedJobs = (url, isNextPage, resolve = () => {}) => ({
  type: `${APP_EVENT.GET_SAVED_JOBS}_WATCHER`,
  action_type: `${APP_EVENT.GET_SAVED_JOBS}_EFFECT`,
  url,
  isNextPage,
  resolve
});

export const setBookmark = (url, jobId, jobRoute) => ({
  type: `${APP_EVENT.SET_BOOKMARK}_WATCHER`,
  action_type: `${APP_EVENT.SET_BOOKMARK}_EFFECT`,
  url,
  jobId,
  jobRoute
});

export const deleteBookmark = (url, jobId, jobRoute) => ({
  type: `${APP_EVENT.DELETE_BOOKMARK}_WATCHER`,
  action_type: `${APP_EVENT.DELETE_BOOKMARK}_EFFECT`,
  url,
  jobId,
  jobRoute
});

export const removeJob = (
  { jobId, pageName },
  url,
  postObj,
  resolve,
  reject
) => {
  return {
    type: `${APP_EVENT.REMOVE_JOB}_WATCHER`,
    action_type: `${APP_EVENT.REMOVE_JOB}_EFFECT`,
    url,
    postObj,
    jobId,
    pageName,
    resolve,
    reject
  };
};

export const getIrrelevantReasons = url => ({
  type: `${APP_EVENT.GET_IRRELEVANT_REASONS}_WATCHER`,
  action_type: `${APP_EVENT.GET_IRRELEVANT_REASONS}_EFFECT`,
  url
});
export function postViewedJob(currentJobId) {
  const url = getUrl(Urlconfig.postViewedJob.replace("{jobId}", currentJobId));
  const { jobData } = store.getState();
  trackCleverTap(
    "JobViewed_browse",
    jobData.jobs[jobData.jobs.length - jobData.activeSwipeJobIndex - 1]
  );
  tracker().on("event", {
    hitName: `browse$job_card_viewed$card$${currentJobId}`
  });
  return {
    type: `${APP_EVENT.POST_VIEWED_JOB}_WATCHER`,
    action_type: `${APP_EVENT.POST_VIEWED_JOB}_EFFECT`,
    url
  };
}
export function postApplyJob(relevanceScore, resolve, reject, jobId, url) {
  let api = url || getUrl(Urlconfig.recommendAndApply);
  api += relevanceScore ? `?relevanceScore=${relevanceScore}` : "";
  return {
    type: `${APP_EVENT.POST_APPLY_JOB}_WATCHER`,
    action_type: `${APP_EVENT.POST_APPLY_JOB}_EFFECT`,
    api,
    resolve,
    reject,
    jobId
  };
}

export const setActiveSwipeJobIndex = activeIndex => ({
  type: `${APP_EVENT.SET_ACTIVE_SWIPE_JOB_INDEX}_WATCHER`,
  action_type: `${APP_EVENT.SET_ACTIVE_SWIPE_JOB_INDEX}_EFFECT`,
  activeIndex
});

export const getCVUploadScreenConfig = (url, resolve, reject) => ({
  type: `${APP_EVENT.GET_CV_UPLOAD_SCREEN_CONFIG}_WATCHER`,
  action_type: `${APP_EVENT.GET_CV_UPLOAD_SCREEN_CONFIG}_EFFECT`,
  url,
  resolve,
  reject
});
