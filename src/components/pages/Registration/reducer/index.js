import APP_EVENT from "../AppEvents";
import APP_EVENT_PROFILE from "../../Profile/AppEvents";

const initialState = {
  config: null,
  jobRoleData: null,
  domainId: null,
  specializationId: null,
  screens: [],
  experimentId: null,
  variationId: null,
  currentScreen: null,
  defaultFlow: [],
  count: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case `${APP_EVENT.GET_REGISTRATION_CONFIG}_EFFECT`:
      return {
        ...state,
        ...action.payload
      };

    case `${APP_EVENT.SET_JOB_ROLE_DATA}_EFFECT`:
      return {
        ...state,
        jobRoleData: action.payload
      };
    case `${APP_EVENT.SET_DOMAIN_ID}_EFFECT`:
      return {
        ...state,
        domainId: action.payload
      };
    case `${APP_EVENT.SET_SPECIALIZATION_ID}_EFFECT`:
      return {
        ...state,
        specializationId: action.payload
      };
    case `${APP_EVENT.GET_NEXT_SCREEN}_EFFECT`:
      // TODO replace destructuring with some readable substitute
      const updatedCurrentScreen = {
        previousScreen: action.payload.previousScreen
      };
      return {
        ...state,
        screens: {
          ...state.screens
        },
        count: state.count + 1,
        currentScreen: updatedCurrentScreen
      };

    case `${APP_EVENT.GET_PREV_SCREEN}_EFFECT`:
      if (state.screens[action.payload].previousScreen) {
        return {
          ...state,
          count: state.count - 1,
          currentScreen:
            state.screens[state.screens[action.payload].previousScreen]
        };
      } else {
        return {
          ...state
        };
      }
    case `${APP_EVENT_PROFILE.UPDATE_CURRENT_SCREEN}_EFFECT`:
      if (typeof action.payload === "string" && state.screens[action.payload]) {
        return {
          ...state,
          currentScreen: { ...state.screens[action.payload] }
        };
      } else {
        return {
          ...state,
          currentScreen: { ...action.payload }
        };
      }

    case `${APP_EVENT_PROFILE.GET_PROFILE_EDIT_SCREENS}_EFFECT`:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}
