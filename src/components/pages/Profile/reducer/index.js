import APP_EVENT from "../AppEvents";

export default function(state = {}, action) {
  switch (action.type) {
    case `${APP_EVENT.GET_BASIC_USER_DETAILS}_EFFECT`:
      return {
        ...state,
        basicUserDetails: { ...action.payload }
      };
    case `${APP_EVENT.GET_PROFILE_EDIT_SCREENS}_EFFECT`:
      return {
        ...state,
        profileEditScreens: { ...action.payload }
      };
    case `${APP_EVENT.GET_USER_PROFILE}_EFFECT`:
      return {
        ...state,
        userProfile: { ...action.payload }
      };
    case `${APP_EVENT.GET_POSITION_DATA}_EFFECT`:
      return {
        ...state,
        positionData: { ...action.payload }
      };
    case `${APP_EVENT.GET_JOB_ROLE_DATA}_EFFECT`:
      return {
        ...state,
        jobRoleData: { ...action.payload }
      };
    default:
      return state;
  }
}
