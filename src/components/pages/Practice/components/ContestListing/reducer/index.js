import APP_EVENT from "../AppEvents";

const initialState = {
  contests: [],
  attemptedContests: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case `${APP_EVENT.GET_CONTEST}_EFFECT`:
      return {
        ...state,
        contests: action.payload
      };

    case `${APP_EVENT.GET_ATTEMPTED_CONTEST}_EFFECT`:
      return {
        ...state,
        attemptedContests: action.payload
      };

    default:
      return state;
  }
};
