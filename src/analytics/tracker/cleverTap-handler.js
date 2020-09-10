import getFormattedDate from "../../utils/pureFns";
import Store from "../../store/Store";

function getCtapParams(parameters) {
  for (const key in parameters) {
    if (Array.isArray(parameters[key])) {
      Object.assign(parameters, { [key]: concatArr(parameters[key]) });
    } else if (
      typeof parameters[key] === "object" &&
      parameters[key] !== null
    ) {
      Object.assign(parameters, { [key]: strigifyValue(parameters[key]) });
    }
  }
  filterParameters(parameters);
  replaceIds(parameters);
  formateDates(parameters);
  return parameters;
}
function trackCleverTapPageView(hitName, parameters) {
  parameters = getCtapParams(parameters);
  const dim = getMyTrackerParams(parameters);
  window.inTrack.push({
    eventType: "click",
    data: {
      eventName: hitName,
      eventCategory: getEventCategory(hitName),
      eventTime: new Date().getTime(),
      dimensions: dim,
      property: "Bigshyft_jobseeker",
      source: "website"
    }
  });
}

function trackCleverTapProfile(parameters) {
  parameters = getCtapParams(parameters);
  const agentId = localStorage.getItem("agentId");
  if (parameters.profile_created) {
    parameters["created_by"] =
      parameters["created_by"] || agentId ? "Agent" : "JS";
    parameters["created_date"] = getFormattedDate();
  } else {
    parameters["updated_by"] =
      parameters["updated_by"] || agentId ? "Agent" : "JS";
    parameters["updated_date"] = getFormattedDate();
  }
  delete parameters.profile_created;
  if(parameters.eventType){
    const eventType = parameters.eventType;
    delete parameters.eventType;
    window.inTrack.push({
      eventType: eventType,
      data: {
        userType: "AGENT",
        property: "Bigshyft_jobseeker",
        source: "website",
        userTags: { ...parameters },
        ...getUtmDetails()
      }
    });
  }
  else if (!parameters.eventType && agentId) {
    window.inTrack.push({
      eventType: parameters.eventType || "profile",
      data: {
        userType: "AGENT",
        property: "Bigshyft_jobseeker",
        source: "website",
        userTags: { ...parameters },
        ...getUtmDetails()
      }
    });
  } else {
    window.inTrack.push({
      eventType: "profile",
      data: {
        property: "Bigshyft_jobseeker",
        source: "website",
        userTags: {
          ...parameters
        },
        ...getUtmDetails()
      }
    });
  }
}

function getUtmDetails() {
  return {
    utmSource: sessionStorage.getItem("utm_source"),
    utmCampaign: sessionStorage.getItem("utm_campaign"),
    utmMedium: sessionStorage.getItem("utm_medium"),
    fbclid: sessionStorage.getItem("fbclid"),
    gclid: sessionStorage.getItem("gclid"),
    previousPageUrl: sessionStorage.getItem("Referral URL")
  };
}
function getUserDetails() {
  const { commonData: { userBasicDetails, userDetails } } = Store.getState();
  const agentId = localStorage.getItem("agentId");
  const parameters = {};
  parameters.user_type = agentId ? "Agent" : "JS";
  if (userBasicDetails) {
    parameters.bigshyft_id = userDetails.profile.userId;
    parameters.name = userBasicDetails.name;
    parameters.is_profile_complete = userDetails.profile.isUserProfileCompleted;
  }
  return parameters;
}
function getEventCategory(event) {
  const category = event.split("_");
  if (category[0] === "pv") {
    return "page_view";
  } else {
    return "click";
  }
}
function getMyTrackerParams(parameters) {
  delete parameters.is_profile_complete;
  const dimensions = [];
  for (const key in parameters) {
    if (parameters[key] !== null) {
      dimensions.push({
        key: key,
        name: parameters[key]
      });
    }
  }
  return dimensions;
}
const filterParameters = parameters => {
  delete parameters.jobDescription;
  delete parameters.aboutCompany;
  delete parameters.companyLogoUrl;
  delete parameters.companyWebsiteURL;
  delete parameters.companyFinancials;
};
const replaceIds = parameters => {
  if (parameters.hasOwnProperty("noticePeriodData")) {
    parameters.noticePeriodId = parameters.noticePeriodData;
    delete parameters.noticePeriodData;
  }
  if (parameters.hasOwnProperty("domain")) {
    parameters.domainId = parameters.domain;
    delete parameters.domain;
  }
  if (parameters.hasOwnProperty("specialization")) {
    parameters.specializationId = parameters.specialization;
    delete parameters.specialization;
  }
};

const formateDates = parameters => {
  if (parameters.hasOwnProperty("postedDate")) {
    parameters.postedDate = getFormattedDate(parameters.postedDate);
  }
  if (parameters.hasOwnProperty("recommendedDate")) {
    parameters.recommendedDate = getFormattedDate(parameters.recommendedDate);
  }
  if (parameters.hasOwnProperty("bookmarkedDate")) {
    parameters.bookmarkedDate = getFormattedDate(parameters.bookmarkedDate);
  }
  if (parameters.hasOwnProperty("viewedDate")) {
    parameters.viewedDate = getFormattedDate(parameters.viewedDate);
  }
};
const concatArr = (arr, key) => {
  let strValue = "";
  if (typeof arr[0] === "object") {
    for (let i = 0, l = arr.length; i < l; i++) {
      strValue += strigifyValue(arr[i]);
      if (i !== l - 1) {
        strValue += ",";
      }
    }
  } else {
    strValue = arr.toString();
  }
  return strValue;
};

const strigifyValue = value => {
  let strValue = "";
  if (Array.isArray(value)) {
    for (let i = 0, l = value.length; i < l; i++) {
      strValue += strigifyValue(value[i]);
      if (i !== l - 1) {
        strValue += ",";
      }
    }
  } else {
    strValue = value.name;
  }
  return strValue;
};

/* eslint-disable no-console */

export default function cleverTapHandler(
  hitType,
  { hitName = "", payload = {} }
) {
  switch (hitType) {
    case "ctapPageView":
      return setTimeout(() => {
        trackCleverTapPageView(hitName, {
          ...payload,
          ...getUtmDetails(),
          ...getUserDetails()
        });
      }, 0);
    case "ctapProfile":
      setTimeout(() => {
        if(payload.eventType){
          trackCleverTapProfile(
            payload
          ); 
        }else{
        trackCleverTapProfile({
          ...payload,
          ...getUserDetails()
        });
      }
      }, 0);
      break;

    case "ctapEvent":
      return setTimeout(() => {
        trackCleverTapPageView(
          hitName,
          {
            ...payload,
            ...getUtmDetails(),
            ...getUserDetails()
          },
          payload.userTags
        );
      }, 0);

    default:
      return null;
  }
}
