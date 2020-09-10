import Store from "../store/Store";
import { userLogout } from "../sagas/ActionCreator";
import getAccessToken from "../utils/getAccessToken";

/* Common service to support http calls */
const defaultConfig = () => ({
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "same-origin"
});

const requiredHeaders = config => ({
  platform: "mweb"
});

function setAndGetUserId() {
  const userId =
    (Store.getState().commonData &&
      Store.getState().commonData.userDetails &&
      Store.getState().commonData.userDetails.profile.userId) ||
    "";
  window.userId = userId;
  return userId;
}

// Common errors to be handled here like errors with status 401
function commonErrorHandler(err) {
  return err.message;
}
function isLogoutUrl(url) {
  if (
    url === "https://www.bigshyft.com/jsapi/user/logout" ||
    url === "https://jsdev.bigshyft.com/jsapi/user/logout"
  ) {
    return true;
  } else {
    return false;
  }
}

const services = {
  get: async function(url, config = {}) {
    config = { ...defaultConfig(), ...config };
    Object.assign(config.headers, requiredHeaders());
    config.headers["n-requestId"] =
      localStorage.getItem("newrelicUserId") +
      "_" +
      config.headers["n-requestId"];
    config.headers.Authorization = "Bearer " + getAccessToken();
    const { apiLabel = null } = config;

    try {
      // measuring the performance of api
      if (apiLabel) {
        window.__bgperformance.mark(apiLabel);
      }
      const data = await fetch(url, {
        method: "GET",
        headers: config.headers
      });

      // measuring the performance of api
      if (apiLabel) {
        window.__bgperformance.apiMeasure(apiLabel);
      }

      if (data.status === 401 && !isLogoutUrl(url)) {
        Store.dispatch(userLogout());
      }

      const jsonData = await data.json();
      return jsonData;
    } catch (error) {
      // measuring the performance of api
      if (apiLabel) {
        window.__bgperformance.apiMeasure(apiLabel);
      }
      return commonErrorHandler(error);
    }
  },
  post: async function(url, postData, config = {}) {
    config = { ...defaultConfig(), ...config };
    Object.assign(config.headers, requiredHeaders(config));

    config.headers.Authorization = config.headers.Authorization
      ? config.headers.Authorization
      : "Bearer " + getAccessToken();
    const { apiLabel = null } = config;
    try {
      if (apiLabel) {
        window.__bgperformance.mark(apiLabel);
      }
      const data = await fetch(url, {
        method: "post",
        headers: config.headers,
        body: JSON.stringify(postData)
      });
      // measuring the performance of api
      if (apiLabel) {
        window.__bgperformance.apiMeasure(apiLabel);
      }

      if (data.status === 401 && !isLogoutUrl(url)) {
        Store.dispatch(userLogout());
      }

      const jsonData = await data.json();
      return jsonData;
    } catch (error) {
      // measuring the performance of api
      if (apiLabel) {
        window.__bgperformance.apiMeasure(apiLabel);
      }
      return commonErrorHandler(error);
    }
  }
};
export default services;
