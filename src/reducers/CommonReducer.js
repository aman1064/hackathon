import APP_EVENT from "../AppEvents";
import APP_EVENT_PROFILE from "../components/pages/Profile/AppEvents";

const initialState = {
  userDetails: {
    accessToken: null,
    mobileNumberExists: false,
    mobileNumberVerified: false,
    profile: {}
  },
  prompt: {},
  isUserRegistered: null,
  userVerify: null,
  forceRecommend: null,
  userBasicDetails: null,
  statusNavRoute: {},
  showWhatsappOptInModal: false,
  suggestors: {
    company: [],
    location: []
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case `${APP_EVENT.USER_DETAILS}_EFFECT`:
      return {
        ...state,
        userDetails: action.payload
      };
    case `${APP_EVENT.SET_ACCESS_TOKEN}_EFFECT`:
      const updatedUserDetails = { ...state.userDetails };
      updatedUserDetails.accessToken = action.payload;
      return {
        ...state,
        userDetails: updatedUserDetails
      };
    case `${APP_EVENT.UPDATE_USER_PROFILE}_EFFECT`:
      let userDetails = { ...state.userDetails };
      userDetails.profile = Object.assign(
        {},
        userDetails.profile,
        action.payload,
        {
          latestCompanyDetails: {
            ...userDetails.profile.latestCompanyDetails,
            ...action.payload.latestCompanyDetails
          }
        }
      );
      return {
        ...state,
        userDetails
      };
    case `${APP_EVENT.OPEN_GLOBAL_PROMPT}_EFFECT`:
      return { ...state, prompt: action.payload };

    case `${APP_EVENT.CLOSE_GLOBAL_PROMPT}_EFFECT`:
      return { ...state, prompt: action.payload };

    case `${APP_EVENT.SET_JOBID}_EFFECT`:
      return {
        ...state,
        jobId: action.payload
      };
    case `${APP_EVENT.IS_USER_REGISTERED}_EFFECT`:
      return {
        ...state,
        isUserRegistered: action.payload
      };
    case `${APP_EVENT.USER_VERIFY}_EFFECT`:
      return {
        ...state,
        userVerify: action.payload
      };
    case `${APP_EVENT.FORCE_RECOMMEND}_EFFECT`:
      return {
        ...state,
        forceRecommend: action.payload
      };
    case `${APP_EVENT_PROFILE.GET_USER_PROFILE}_EFFECT`:
      userDetails = { ...state.userDetails };
      userDetails.profile = { ...action.payload };
      return {
        ...state,
        userDetails
      };

    case `${APP_EVENT.SET_MOBILE_NUMBER_EXISTS}_EFFECT`:
      userDetails = { ...state.userDetails };
      userDetails.mobileNumberExists = action.payload;
      return {
        ...state,
        userDetails
      };
    case `${APP_EVENT.GET_USER_BASIC_DETAILS}_EFFECT`:
      return {
        ...state,
        userBasicDetails: action.payload
      };
    case `${APP_EVENT.SET_STATUS_NAV_ROUTE}_EFFECT`:
      return {
        ...state,
        statusNavRoute: action.payload
      };
    case `${APP_EVENT.WHATSAPP_OPT_IN}_EFFECT`:
      const userBasicDetails = { ...state.userBasicDetails };
      userBasicDetails.whatsappSubscription =
        action.payload.whatsappSubscription;

      return {
        ...state,
        userBasicDetails
      };
    case `${APP_EVENT.SET_WHATSAPP_OPT_IN}_EFFECT`:
      return {
        ...state,
        showWhatsappOptInModal: action.payload.data,
        isJobApplied: action.payload.isJobApplied,
        trackerCat: action.payload.trackerCat
      };
    case `${APP_EVENT.GET_PREFETCH_SUGGESTORS}_EFFECT`:
      return {
        ...state,
        suggestors: {
          ...state.suggestors,
          ...action.payload.data,
          updatedTime: action.payload.currentTime
        }
      };

    default:
      return state;
  }
}
