import store from "../store/Store";
import Urlconfig from "../constants/Urlconfig";

export function getUrl(url, specificBase) {
  const baseUrl = specificBase || Urlconfig.base;
  const formState = store.getState();
  const commonData = formState.commonData;
  const { domain, specialization } = commonData.userDetails.profile;
  const profileId = commonData.userDetails.profile.id || "";
  const userId = commonData.userDetails.profile.userId;
  const pageId =
    formState.registrationData.currentScreen &&
    formState.registrationData.currentScreen.id;
  let formData = formState.forms[pageId];
  let courseId =
    formData &&
    formData.values &&
    formData.values
      .latestEducationDetails$course$singleSelectionWithSuggestor &&
    formData.values.latestEducationDetails$course$singleSelectionWithSuggestor
      .id;
  if (!courseId) {
    formData = formState.forms["quickRegistration"];
    courseId =
      formData &&
      formData.values &&
      formData.values.course &&
      formData.values.course.id;
  }
  url = url.replace("{profileId}", profileId);
  url = url.replace("{domainId}", domain && domain.id);
  url = url.replace("{specializationId}", specialization && specialization.id);
  url = url.replace("{courseId}", courseId || "");
  url = url.replace("{userId}", userId);
  url = url.replace("{jobId}", commonData.jobId);
  url = `${baseUrl}${url}`;
  return url;
}

export const getPublicJdURL = (jobId, jobTitle) => {
  let modifiedJobTitle = jobTitle.split(" ").join("-");
  modifiedJobTitle = modifiedJobTitle.replace(
    /[&\/\\#,+()!^\"'`[\]@$%*?<>{} =;:~._]/g,
    "-"
  );
  const url = `/jobs/jd/${jobId}/${modifiedJobTitle}`;
  return url;
};
