import { all } from "redux-saga/effects";
import jobsWatcherSaga from "../components/pages/Jobs/saga";
import registrationWatcherSaga from "../components/pages/Registration/saga";
import commonWatcherSaga from "./CommonSaga";
import profileWatcherSaga from "../components/pages/Profile/saga";
import otpPageWatcherSaga from "../components/pages/OtpPage/saga";
import contestsWatcherSaga from "../components/pages/Practice/components/ContestListing/saga";
import contestQAWatcher from "../components/pages/Practice/components/Contest/saga";
import PracticeSaga from "../components/pages/Practice/redux/PracticeSaga";

export default function* rootSaga() {
  yield all([
    jobsWatcherSaga(),
    registrationWatcherSaga(),
    commonWatcherSaga(),
    profileWatcherSaga(),
    otpPageWatcherSaga(),
    contestsWatcherSaga(),
    contestQAWatcher(),
    PracticeSaga()
  ]);
}
