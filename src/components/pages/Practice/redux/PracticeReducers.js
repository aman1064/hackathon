import APP_EVENT from "./AppEvents";

const initialState = {
  quizList: {
    data: null,
    isError: false,
    isLoading: false
  },
  quizDetails: {
    data: null,
    isError: false,
    isLoading: false
  },
  recommendedJobs: {
    data: null,
    isError: false,
    isLoading: false
  },
  insights: {
    data: null,
    isError: false,
    isLoading: false
  },
  leaderboard: {
    data: null,
    isError: false,
    isLoading: false
  },
  performance: {
    data: null,
    isError: false,
    isLoading: false
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case APP_EVENT.QUIZ_LIST_LOADING:
      return {
        ...state,
        quizList: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_QUIZ_LIST}_EFFECT`:
      return {
        ...state,
        quizList: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.QUIZ_LIST_ERROR:
      return {
        ...state,
        quizList: { data: null, isLoading: false, isError: true }
      };

    case APP_EVENT.QUIZ_DETAILS_LOADING:
      return {
        ...state,
        quizDetails: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_QUIZ_DETAILS}_EFFECT`:
      return {
        ...state,
        quizDetails: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.QUIZ_DETAILS_ERROR:
      return {
        ...state,
        quizDetails: { data: null, isLoading: false, isError: true }
      };

    case APP_EVENT.RECOMMENDED_JOBS_IN_QUIZ_LOADING:
      return {
        ...state,
        recommendedJobs: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_RECOMMENDED_JOBS_IN_QUIZ}_EFFECT`:
      return {
        ...state,
        recommendedJobs: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.RECOMMENDED_JOBS_IN_QUIZ_ERROR:
      return {
        ...state,
        recommendedJobs: { data: null, isLoading: false, isError: true }
      };

    case APP_EVENT.ATTEMPT_INSIGHTS_LOADING:
      return {
        ...state,
        insights: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_ATTEMPT_INSIGHTS}_EFFECT`:
      return {
        ...state,
        insights: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.ATTEMPT_INSIGHTS_ERROR:
      return {
        ...state,
        insights: { data: null, isLoading: false, isError: true }
      };

    case APP_EVENT.LEADERBOARD_DATA_LOADING:
      return {
        ...state,
        leaderboard: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_LEADERBOARD_DATA}_EFFECT`:
      return {
        ...state,
        leaderboard: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.LEADERBOARD_DATA_ERROR:
      return {
        ...state,
        leaderboard: { data: null, isLoading: false, isError: true }
      };

    case `${APP_EVENT.SET_SELECTED_CONTEST}_EFFECT`:
      return {
        ...state,
        selectedContest: action.payload
      };

    case APP_EVENT.PERFORMANCE_DATA_LOADING:
      return {
        ...state,
        performance: { data: null, isLoading: true, isError: false }
      };

    case `${APP_EVENT.GET_PERFORMANCE_DATA}_EFFECT`:
      return {
        ...state,
        performance: {
          data: action.payload.data,
          isLoading: false,
          isError: false
        }
      };

    case APP_EVENT.PERFORMANCE_DATA_ERROR:
      return {
        ...state,
        performance: { data: null, isLoading: false, isError: true }
      };

    default:
      return state;
  }
}
