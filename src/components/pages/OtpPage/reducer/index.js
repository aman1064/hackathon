import APP_EVENT from "../AppEvents";

const initialState = {
  interactionId: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case `${APP_EVENT.SET_INTERACTION_ID}_EFFECT`:
      return {
        ...state,
        interactionId: action.payload
      };

    default:
      return state;
  }
}
