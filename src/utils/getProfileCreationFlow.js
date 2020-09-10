const getProfileCreationFlow = () => {
  const url = window.location.href;
  let flow = "";
  if (url.includes("/quickapply/")) {
    flow = "quickApply";
  } else if (url.includes("/profile/")) {
    flow = "profile";
  } else if (url.includes("/registration/")) {
    flow = "registration";
  } else if (url.includes("/jobs/")) {
    flow = "InstaApply Flow";
  }
  return flow;
};

export default getProfileCreationFlow;
