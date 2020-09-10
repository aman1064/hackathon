/* eslint-disable no-else-return */
import APP_EVENT from "../AppEvents";

export default function(state = { jobs: [] }, action) {
  let updatedJobs;
  let updatedBrowseJobs;
  switch (action.type) {
    case `${APP_EVENT.GET_RECOMMENDED_JOBS}_EFFECT`: {
      let jobs;
      let newJobs;
      if (action.payload.isFresh) {
        newJobs = [...action.payload.data.jobs.reverse()];
        sessionStorage.setItem(
          "totalJobCount",
          action.payload.data.totalElements
        );
      } else {
        jobs = [...action.payload.data.jobs.reverse(), ...state.jobs];
        const jobObj = {};
        jobs.forEach(job => {
          jobObj[job.jobId] = job;
        });
        newJobs = Object.values(jobObj);
      }
      return {
        ...state,
        jobs: [...newJobs],
        recommendedJobs: { ...action.payload.data }
      };
    }

    case `${APP_EVENT.GET_JOB_DETAILS}_EFFECT`: {
      const jobDetails = { ...action.payload };
      const aboutCompany = [
        {
          name: "Company Type",
          value: jobDetails.companyType
        },
        {
          name: "Industry",
          value: jobDetails.industry
        },
        {
          name: "Website",
          value: jobDetails.companyWebsiteURL
        },
        {
          name: "Company Size",
          value: jobDetails.companySize
        },
        {
          name: "Company Financials",
          value: jobDetails.companyFinancials,
          action: "company_financial"
        },
        {
          name: "Office Locations",
          value: jobDetails.companyLocation
        }
      ];
      return {
        ...state,
        jobDetails,
        aboutCompany
      };
    }
    case `${APP_EVENT.SET_JOBID}_EFFECT`:
      return {
        ...state,
        jobId: action.payload
      };
    case `${APP_EVENT.GET_VIEWED_JOBS}_EFFECT`:
      return action.payload.isNextPage
        ? {
            ...state,
            viewedJobs: {
              ...state.viewedJobs,
              jobs: state.viewedJobs.jobs.concat(action.payload.data.jobs)
            }
          }
        : {
            ...state,
            viewedJobs: { ...action.payload.data }
          };
    case `${APP_EVENT.GET_SAVED_JOBS}_EFFECT`:
      return action.payload.isNextPage
        ? {
            ...state,
            savedJobs: {
              ...state.savedJobs,
              jobs: state.savedJobs.jobs.concat(action.payload.data.jobs)
            }
          }
        : {
            ...state,
            savedJobs: { ...action.payload.data }
          };
    case `${APP_EVENT.GET_IRRELEVANT_REASONS}_EFFECT`:
      return {
        ...state,
        irrelevantReasons: action.payload
      };
    case `${APP_EVENT.SET_ACTIVE_SWIPE_JOB_INDEX}_EFFECT`:
      return {
        ...state,
        activeSwipeJobIndex: action.payload
      };
    case `${APP_EVENT.REMOVE_JOB}_EFFECT`: {
      const { pageName } = action.payload;
      const isJobsViewPageData =
        state.jobs &&
        state.jobs.find(job => job.jobId === action.payload.jobId);
      if (isJobsViewPageData) {
        const jobData = state.jobs.filter(job => {
          return job.jobId !== action.payload.jobId;
        });
        sessionStorage.setItem("jobs", JSON.stringify(jobData));
        // eslint-disable-next-line no-param-reassign
        state.jobs = jobData;
        // eslint-disable-next-line no-param-reassign
        state.recommendedJobs.totalElements = jobData.length;
        sessionStorage.setItem(
          "totalJobCount",
          JSON.parse(sessionStorage.getItem("totalJobCount")) - 1
        );
      }
      if (pageName !== "jobs") {
        const updatedSavedJobsData = { ...state.savedJobs };
        const updatedSavedJobs = state.savedJobs.jobs.filter(job => {
          return job.jobId !== action.payload.jobId;
        });
        updatedSavedJobsData.jobs = updatedSavedJobs;
        const index = state.savedJobs.jobs.findIndex(
          job => job.jobId === action.payload.jobId
        );
        if (index >= 0) {
          updatedSavedJobsData.totalElements =
            state.savedJobs.totalElements - 1;
        }
        const updatedViewedJobsData = { ...state.viewedJobs };
        const updatedViewedJobs = state.viewedJobs.jobs.filter(job => {
          return job.jobId !== action.payload.jobId;
        });
        updatedViewedJobsData.jobs = updatedViewedJobs;
        updatedViewedJobsData.totalElements =
          state.viewedJobs.totalElements - 1;
        return {
          ...state,
          viewedJobs: updatedViewedJobsData,
          savedJobs: updatedSavedJobsData
        };
      }
      return {
        ...state
      };
    }

    case `${APP_EVENT.SET_BOOKMARK}_EFFECT`:
      updatedBrowseJobs = state.jobs.map(el => {
        if (el.jobId === action.payload.jobId) {
          // eslint-disable-next-line no-param-reassign
          el.bookmarkedDate = true;
        }
        return el;
      });
      if (
        action.payload.jobRoute === "browse" ||
        action.payload.jobRoute === "knowMore"
      ) {
        return { ...state, jobs: updatedBrowseJobs };
      } else if (action.payload.jobRoute === "viewed") {
        const updatedSavedJobsData = { ...state.savedJobs };
        updatedJobs = state.viewedJobs.jobs.map(el => {
          if (el.jobId === action.payload.jobId) {
            // eslint-disable-next-line no-param-reassign
            el.bookmarkedDate = true;
            updatedSavedJobsData.jobs.push(el);
            updatedSavedJobsData.totalElements =
              state.savedJobs.totalElements + 1;
          }
          return el;
        });
        return {
          ...state,
          jobs: updatedBrowseJobs,
          viewedJobs: { ...state.viewedJobs, jobs: updatedJobs },
          savedJobs: updatedSavedJobsData
        };
      } else if (action.payload.jobRoute === "saved") {
        updatedJobs = state.savedJobs.jobs.map(el => {
          if (el.jobId === action.payload.jobId) {
            // eslint-disable-next-line no-param-reassign
            el.bookmarkedDate = true;
          }
          return el;
        });
        return {
          ...state,
          jobs: updatedBrowseJobs,
          savedJobs: { ...state.savedJobs, jobs: updatedJobs }
        };
      } else {
        return { ...state };
      }

    case `${APP_EVENT.DELETE_BOOKMARK}_EFFECT`: {
      // updating saved job data after delete bookmark click
      let updatedSavedJobsData;
      if (state.savedJobs) {
        updatedSavedJobsData = { ...state.savedJobs };
        const updatedSavedJobs = state.savedJobs.jobs.filter(
          el => el.jobId !== action.payload.jobId
        );
        updatedSavedJobsData.jobs = updatedSavedJobs;
        updatedSavedJobsData.totalElements = state.savedJobs.totalElements - 1;
      }
      updatedBrowseJobs = state.jobs.map(el => {
        if (el.jobId === action.payload.jobId) {
          // eslint-disable-next-line no-param-reassign
          el.bookmarkedDate = false;
        }
        return el;
      });

      if (
        action.payload.jobRoute === "browse" ||
        action.payload.jobRoute === "knowMore"
      ) {
        return { ...state, jobs: updatedBrowseJobs };
      } else if (action.payload.jobRoute === "viewed") {
        updatedJobs = state.viewedJobs.jobs.map(el => {
          if (el.jobId === action.payload.jobId) {
            // eslint-disable-next-line no-param-reassign
            el.bookmarkedDate = false;
          }
          return el;
        });
        return {
          ...state,
          jobs: updatedBrowseJobs,
          viewedJobs: { ...state.viewedJobs, jobs: updatedJobs },
          savedJobs: updatedSavedJobsData
        };
      } else if (action.payload.jobRoute === "saved") {
        return {
          ...state,
          jobs: updatedBrowseJobs,
          savedJobs: updatedSavedJobsData
        };
      } else {
        return { ...state };
      }
    }
    case `${APP_EVENT.POST_APPLY_JOB}_EFFECT`:
      // eslint-disable-next-line no-case-declarations
      const isJobsViewPageData =
        state.jobs && state.jobs.find(job => job.jobId === action.payload);
      if (isJobsViewPageData) {
        const jobData = state.jobs.filter(job => {
          return job.jobId !== action.payload;
        });
        sessionStorage.setItem("jobs", JSON.stringify(jobData));
        // eslint-disable-next-line no-param-reassign
        state.jobs = jobData;
        // eslint-disable-next-line no-param-reassign
        state.recommendedJobs.totalElements = jobData.length;
        sessionStorage.setItem(
          "totalJobCount",
          JSON.parse(sessionStorage.getItem("totalJobCount")) - 1
        );
      }
      return {
        ...state
      };

    default:
      return state;
  }
}
