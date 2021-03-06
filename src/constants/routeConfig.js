const routeConfig = {
  home: "/home",
  login: "/login",
  signup: "/signup",
  root: "/",
  addPhoneNumber: "/registration/addPhoneNumber",
  forgotPassword: "/forgotpassword",
  errorPage: "/errorPage",
  publicJD: "/jobs/jd/:jobId/:other",
  otpPage: "/otpVerification",
  practice: "/practice",
  practiceDetails: "/practice/group/:id",
  practiceInsights: "/practice/insights/:id",
  practiceContest: "/practice/contest/:contestId",
  practiceBrowseQuiz: "/practice/browseTest",
  practicePerformanceHistory: "/practice/performance",
  practicePerformanceHistoryWithId: "/practice/performance/:id",
  practiceSignup: "/practice/signup",
  companyLanding: "/company/:id",
  companyAnalytics: "/analytics/:id",
  companyJobDetail: "/company/:id/:jobId",
  exibitorFloor: "/exibitorFloor",
  noticeBoard: "/notice-board"
};

export default routeConfig;
