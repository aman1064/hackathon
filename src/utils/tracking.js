export function filterJobDetailsForCleverTap(jobDetails) {
  if (!jobDetails) {
    return;
  }
  const filterJobDetails = {
    job_location: jobDetails.cities.join(","),
    job_id: jobDetails.jobId,
    job_url: jobDetails.companyWebsiteURL,
    max_ctc: jobDetails.maxCTC,
    max_exp: jobDetails.maxExperience,
    min_ctc: jobDetails.minCTC,
    min_exp: jobDetails.minExperience,
    company_name: jobDetails.companyName,
    job_title: jobDetails.designation,
    relevanceScore: jobDetails.relevanceScore,
    company_id: jobDetails.companyId,
    company_logo_url: jobDetails.companyLogoUrl,
    recruiter_name: jobDetails.recruiterName,
    recruiter_id: jobDetails.recruiterId,
    job_role: jobDetails.jobRole
  };
  return filterJobDetails;
}
export function getParsedSkillsObj(profileObj) {
  if (profileObj.hasOwnProperty("skills")) {
    for (let i = 0, l = profileObj.skills.length; i < l; i++) {
      profileObj[`skill_${i + 1}`] = profileObj.skills[i].name;
      profileObj[`experienceMonth_${i + 1}`] =
        profileObj.skills[i].experienceMonth || 0;
      profileObj[`experienceYear_${i + 1}`] =
        profileObj.skills[i].experienceYear || 0;
    }
  }
  delete profileObj.skills;
  return profileObj;
}
export function trackCleverTap() {}

export function trackCT() {}

export function uba({ pageName, eventName, keyNames }) {}

export function nTrack(obj) {}
