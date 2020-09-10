import APP_EVENT from "../AppEvents";

const initialState = {
  contestAttemptId: "",
  question: undefined,
  totalScore: 0,
  totalCorrectQuestions: 0,
  isQuizComplete: false,
  isAnswerRight: null,
  isQuizBegin: false,
  questSubmitting: false,
  isContestStart: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `${APP_EVENT.START_CONTEST_QUEST}_EFFECT`:
      return {
        ...state,
        ...action.payload,
        questSubmitting: false,
        isContestStart: true
      };

    case `${APP_EVENT.SUBMIT_CONTEST_QUEST}_EFFECT`:
      return { ...state, ...action.payload, questSubmitting: false };

    case `${APP_EVENT.RESET_SUBMITTING}_EFFECT`:
      return { ...state, questSubmitting: false };

    case `${APP_EVENT.START_CONTEST_QUEST}__WATCHER`:
    case `${APP_EVENT.SUBMIT_CONTEST_QUEST}_WATCHER`:
      return { ...state, questSubmitting: true };

    case APP_EVENT.BEGIN_QUIZ:
      return {
        ...state,
        ...(action.payload ? initialState : undefined),
        isQuizBegin: action.payload,
        isContestStart: false
      };

    case APP_EVENT.RESET_CONTEST_QUEST: {
      return initialState;
    }

    default:
      return state;
  }
};
