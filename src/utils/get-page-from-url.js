import store from "../store/Store";
// TODO: Need to add regex here
const urlToScreenMapObj = {
  "/jobs/viewedJobs": "Viewed Jobs",
  "/jobs/savedJobs": "Saved Jobs",
  "/login": "SignIn",
  "/signup": "SignUp",
  "/profile": "Profile",
  "/registration/*": "Registration",
  "/home": "Home",
  "/jobs?jobId=[0-9]+": "Detailed Jd",
  "/applied": "Applied Jobs",
  "/jobs/instaApply/[0-9]+": "Insta Apply",
  "/jobs/instaCVUpload/[0-9]+": "Insta CVUpload",
  "/jobs/updateApply/[0-9]+": "Insta Apply Update",
  "/jobs/jd/[0-9]+/[a-zA-Z0-9_]": "Public JD",
  "/jobs[?]jobId=[0-9]": "Detailed Jd View",
  "/jobs/[?]jobId=[0-9]": "Detailed Jd View",
  "/jobs": "Jobs",
  "/otpVerification": "OtpView",
  "/software-jobs": "Job Landing View",
  "^/$/": "Home"
};

export default function getPageFromUrl(url) {
  const pathname =
    typeof url === "undefined"
      ? window.location.pathname + window.location.search
      : url;
  const regData = store.getState().registrationData;
  if (pathname.includes("profile/") || pathname.includes("registration/")) {
    return (
      regData.screens &&
      regData.screens[pathname.split("/")[2]] &&
      regData.screens[pathname.split("/")[2]].description
    );
  }

  let category = Object.keys(urlToScreenMapObj).find(path => {
    const regEx = new RegExp(path);
    return regEx.test(pathname);
  });
  category = urlToScreenMapObj[category] || undefined;

  return category;
}
