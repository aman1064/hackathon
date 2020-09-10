const routeConfig = {
  jobs: "/jobs",
  viewedJobs: "/jobs/viewedJobs",
  savedJobs: "/jobs/savedJobs",
  applied: "/applied",
  home: "/home",
  profile: "/profile",
  registration: "/registration",
  regWithId: "/registration/:id",
  login: "/login",
  signup: "/signup",
  root: "/",
  profileEdit: "/profile/:id",
  profileSetting: "/profile/setting",
  applyWithCV: "/jobs/knowMore/uploadCV",
  inviteOnly: "/inviteOnly",
  addPhoneNumber: "/registration/addPhoneNumber",
  noDomain: "/registration/noDomain",
  forgotPassword: "/forgotpassword",
  quickApplyJob: "/quickapply/jobDetails",
  quickApplyProfile: "/quickapply/profile",
  quickApplyCVUpdate: "/quickappdly/CVUpdate",
  quickApplyProfileEdit: "/quickapply/profile/edit",
  quickApplySplashScreen: "/quickapply/splashScreen",
  errorPage: "/errorPage",
  unsubscribe: "/unsubscribe",
  publicJD: "/jobs/jd/:jobId/:other",
  instaApply: "/jobs/instaApply/:jobId",
  instaCVUpload: "/jobs/instaCVUpload/:jobId",
  instaApplyUpdate: "/jobs/updateApply/:jobId",
  otpPage: "/otpVerification",
  incompleteProfile: "/incompleteProfile",
  softwareJobs: "/software-jobs",
  userConsent: "/UserConsent",
  consent: "/consent/updateReasons",
  consentJd: "/jobs/consent",
  practice: "/practice",
  practiceDetails: "/practice/group/:id",
  practiceInsights: "/practice/insights/:id",
  practiceContest: "/practice/contest/:contestId",
  practiceBrowseQuiz: "/practice/browseTest",
  practicePerformanceHistory: "/practice/performance",
  practicePerformanceHistoryWithId: "/practice/performance/:id",
  practiceSignup: "/practice/signup",
  collection: "/collection/:collectionName",
  createJs: "/createjs"
};

export const routeMetaInfo = {
  [routeConfig.covidLandingPage]: {
    title: "Play for a cause",
    "og:title": "Play for a cause",
    "og:description":
      "An initiative by BigShyft to respond to the COVID-19 pandemic by raising funds with your support"
  },
  [routeConfig.covidThankYou]: {
    title: "Thank you for your support"
  },
  [routeConfig.covidLeaderBoard]: {
    title: "Thank you for your support"
  }
};

export default routeConfig;
