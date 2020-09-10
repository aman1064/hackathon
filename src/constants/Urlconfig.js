import { serverBase, codeBase, recruiterUrl } from "./config";

const base = serverBase;

const Urlconfig = {
  codeBase,
  recruiterUrl,
  recommendedJobs: `/jobseeker/v1/recommendations/user/{userId}/profile/{profileId}`,
  recommendedJobsPostView: `/jobseeker/v1/recommendations/skipAndLimit/user/{userId}/profile/{profileId}`,
  jobDetails: `/jobseeker/v1/jobDescription/user/{userId}/profile/{profileId}/job/{jobId}`,
  appliedJobs: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/apply`,
  viewedJobs: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/viewed`,
  savedJobs: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/bookmarked`,
  bookmarkJob: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/bookmarked`,
  recommendAndBookmark: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/recommendAndBookmark`,
  unBookmarkJob: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/unbookmarked`,
  removeJob: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/irrelevant`,
  recommendAndIrrelevant: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/recommendAndIrrelevant`,
  irrelevantReasons: `${base}/suggestions/v2/suggestions/jobIrrelevantReasons`,

  registrationScreenConfig: `${base}/users/apps/jobseeker/module/registration/screens`,
  getNextScreen: `${base}/users/{userId}/apps/jobseeker/experiments/{experimentId}/variations/{variationId}/nextScreen`,
  login: `${base}/auth/v2/otp/login/sendOTP`,
  validateLoginOtp: `${base}/auth/v2/otp/login/validateOTP`,
  signup: `${base}/auth/v2/otp/register/sendOTP`,
  validateSignupOtp: `${base}/auth/v2/otp/register/validateOTP`,
  signupScreen: `${base}/users/apps/jobseeker/module/signup/screens`,

  getBasicUserDetails: "/jobseeker/v1/basic/details",
  getProfileEditScreens: `${base}/users/apps/jobseeker/module/profileEdit/screens`,
  getUserProfile: `/jobseeker/v2/profile/{profileId}`,
  getJobRoleData: "/domains/specializations/{specializationId}",
  getSkillsSuggesterData:
    "/suggestions/v2/suggestions/skill/grandParent/{domainId}?input={input}",

  getspecializationData:
    "/suggestions/v2/suggestions/specialization/parent/{domainId}?size=100",
  getQuickJobDetails: `${base}/jobseeker/v1/job/jobdetails/{jobId}`,
  getTempProfileDetails: `${base}/account/v2/user/details`,
  getNoticePeriodData: `/suggestions/noticePeriod`,
  isUserRegistered: `${base}/account/user/isRegistered`,
  userVerify: `${base}/user/verify`,
  getUserBasicDetails: `${base}/jobseeker/v1/basic/details`,
  getValidSpecializations: `${base}/jobseeker/v1/job/allowedDomainAndSpecializations`,

  // post url
  postViewedJob: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/viewed`,
  recommendAndApply: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/recommendAndApply`,
  postUpdateUserProfile: `/jobseeker/v2/profile/{profileId}/update`,
  postCompletedProfile: `/jobseeker/v1/profile/{profileId}/profileCompleted`,
  postUpdateUserDetails: `/user/update/userDetails`,
  sendForgotPasswordLink: `${base}/account/recover`,
  changePassword: `${base}/account/v2/changePassword`,
  postUserPing: `${base}/user/ping`,
  userLogout: `${base}/user/logout`,
  quickApplyRegistration: `${base}/account/v2/user/register`,
  forceRecommendAndApply: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/jobs/{jobId}/forceRecommendAndApply`,
  forceRecommend: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/jobs/{jobId}/forceRecommend`,
  applyModeration: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/jobs/{jobId}/quickApply/delay/15`,
  quickApplyCvUpload: `${base}/account/user/upload/cv/delete`,
  getCollegeWithCourseId: `/suggestions/v2/suggestions/college?input={input}&parent={courseId}&size=10000`,
  getCollege: `/suggestions/v2/suggestions/college?input={input}&size=10000`,
  getCourse: "/suggestions/courses?size=10000",
  getCourseInput: `/suggestions/v2/suggestions/course?input={input}&size=2000`,
  getCourseDepartment: `/suggestions/v2/suggestions/courseDepartment?input={input}&parent={courseId}&size=10000`,
  getJobTitles: `/suggestions/domains/{domainId}/jobTitles?input={input}`,
  getCompanies: `/suggestions/v2/suggestions/company?input={input}&size=10000`,
  getLocation: `/suggestions/v2/suggestions/location?input={input}&size=10000`,
  getCompanies_suggestor: `/suggestions/v2/suggestions/company?input={input}&size=10000`,
  getLocation_suggestor: `/suggestions/v2/suggestions/location?input={input}&size=10000`,
  getAllSuggestorsByTime: `/suggestions/v2/suggestions/byTime/{lastUpdatedTime}?type=location,company`,
  base,
  newmonk: {
    performance: "https://logs.naukri.com/uba"
  },
  noticePeriod: `${base}/suggestions/noticePeriod`,

  socialLogin: `${base}/auth/login`,
  sendSocialLoginOTP: `${base}/user/v2/otp/sendOTP`,
  validateSocialLoginOTP: `${base}/user/v2/otp/verifyAndLink`,
  getAllSectionData: `${base}/jobseeker/v1/job/jobdetails/section/list?sectionCount={sectionCount}&sectionsWithData={sectionsWithData}&jobPerSection={jobPerSection}`,
  getNextSectionData: `${base}/jobseeker/v1/job/jobdetails/section/list/{sectionId}?skip={offset}&limit={jobCount}`,
  /* Whatsapp Opt in */
  whatsappSubscribe: `${base}/user/whatsapp/subscribe`,
  getWhatsappStatus: `${base}/user/whatsapp/status*`,
  /* User Consent */
  getConsentOTP: `${base}/communication/tempUser/activate`,
  postMarkNotInterested: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/markNotInterested?rcvId={rcvId}`,
  postMarkInterested: `/jobseeker/v1/actions/user/{userId}/profile/{profileId}/job/{jobId}/markInterested?rcvId={rcvId}`,
  postUpdateNotInterested: `${base}/jobseeker/v1/awek/user/profile/job/markNotInterested/updateReason?userId={userId}&profileId={profileId}&jobId={jobId}`,

  // covid-19
  getContest: "/contest/list",
  getContestStats: "/contest/stats",
  getLeaderBoard: `${base}/contest/{contestId}/leaderBoard`,
  getGlobalLeaderBoard: `${base}/contest/leaderBoard/global?profileId={profileId}`,
  startContest: (contestId, profileId) =>
    `/contest/${contestId}/profile/${profileId}`,
  submitContestQuest: (contestId, profileId) =>
    `/contest/${contestId}/profile/${profileId}/submit`,
  getAttemptedTests: profileId => `/contest/profile/${profileId}/attempts`,
  downloadCertificate: (contestId, profileId, attemptId) =>
    `/contest/${contestId}/profile/${profileId}/attempt/${attemptId}/certificate`,
  postShareSuccess: `${base}/contest/share/{attemptId}`,
  getRecommendedJobs: `/contest/profile/{profileId}/jobs`,
  // unsubscribe
  saveUnsubscribeReasons: unSubscriptionId =>
    `${base}/communication/user/mail/unsubscribe/${unSubscriptionId}/update`,
  // practise
  getQuizList: `/contest/groups`,
  getQuizDetails: `/contest/group/details?groupId={groupId}&profileId={profileId}`,
  getRecommendedJobsInQuiz: `/contest/jobs/group/{groupId}`,
  getAttemptInsights:
    "/contest/attempt/{attemptId}/insights?profileId={profileId}",
  getGroupLeaderboard: `/contest/group/leaderboard?groupId={groupId}&profileId={profileId}`,
  getContestLeaderboard: `/contest/{contestId}/leaderboard?profileId={profileId}`,
  getPerformanceHistory: `/contest/attempt/insights/profile/{profileId}`,
  /* Collection View */
  collectionData: `${base}/jobseeker/v1/job/jobdetails/collection/{collectionName}?page={page}&size={size}`,
  getReverseMap: `${base}/suggestions/v2/suggestions/byTime/0/reverseMap?type=college,location,company,courseDepartment,noticePeriod,preferredBenefits,preferredCompanyType,preferredRoles,course`
};
export default Urlconfig;
