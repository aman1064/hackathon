import { combineReducers } from "redux";

import jobsReducer from "../components/pages/Jobs/reducer";
import registrationReducer from "../components/pages/Registration/reducer";
import commonData from "./CommonReducer";
import APP_EVENT from "../AppEvents";
import profileReducer from "../components/pages/Profile/reducer";
import otpReducer from "../components/pages/OtpPage/reducer";
import formReducer from "../components/organisms/Field/reducer";
import contestListReducer from "../components/pages/Practice/components/ContestListing/reducer";
import contestQuestReducer from "../components/pages/Practice/components/Contest/reducer";
import PracticeReducers from "../components/pages/Practice/redux/PracticeReducers";

const appReducer = combineReducers({
  forms: formReducer,
  jobData: jobsReducer,
  registrationData: registrationReducer,
  commonData: commonData,
  userProfileData: profileReducer,
  otpData: otpReducer,
  contestList: contestListReducer,
  contestQuest: contestQuestReducer,
  practice: PracticeReducers
});
const rootReducer = (state, action) => {
  if (
    action.type === `${APP_EVENT.USER_LOGOUT}_EFFECT` ||
    action.type === `${APP_EVENT.EMPTY_STATE}_EFFECT`
  ) {
    localStorage.clear();
    sessionStorage.clear();
    window.userId = "";
    document.cookie =
      "session= ; expires = Thu, 01 Jan 1970 00:00:00 GMT ;covidMsgCrossed=false";
    window.GLOBAL_MAPPED_PROFILE_OBJ = {};
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
