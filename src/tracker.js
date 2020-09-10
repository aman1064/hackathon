import { codeBase } from "./constants/config";
import { uuidv4 } from "./utils/pureFns";
import { getCookie, setCookie } from "./utils/Cookie";
import services from "./utils/services";
import getAccessToken from "./utils/getAccessToken";
import Store from "./store/Store";

(function() {
  function getUuidFromLocalStorage() {
    return getCookie("uuid");
  }

  function generateUUID() {
    var uuid = getUuidFromLocalStorage();
    if (!uuid) {
      uuid = uuidv4();
      document.cookie = `uuid=${uuid};path=/`;
    }
    return uuid;
  }

  function updateSession() {
    var currentDate = new Date();
    sessionExpiry = currentDate.setMinutes(currentDate.getMinutes() + 30);
    localStorage.setItem("sessionExpiry", sessionExpiry);
  }

  function setSession() {
    var currentDate = new Date();
    var sessionStart = new Date(new Date().toString());
    sessionExpiry = currentDate.setMinutes(currentDate.getMinutes() + 30);
    localStorage.setItem("sessionExpiry", sessionExpiry);
    document.cookie = `session=${sessionStart};path=/`;
    return sessionStart;
  }

  function isSessionValid(sessionTime) {
    var currentDate = new Date();
    const currentTime = currentDate.getTime();

    if (sessionTime >= currentTime) {
      return true;
    }
    return false;
  }

  function postData(url = "", data = {},eventType) {
    return services.post(url, data, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        "Authorization": eventType === "profile_without_accesstoken"? "Bearer" : "Bearer " + getAccessToken(),
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      apiLabel: "Instrument",
      userId : eventType === "profile_without_accesstoken" ? data.userId : ""
    });
  }

  var trackingObj = {};
  var uuid = generateUUID();

  var currentSession = getCookie("session") || 0;
  if (!getCookie("session")) {
    currentSession = setSession();
  }

  var sessionExpiry = localStorage.getItem("sessionExpiry") || 0;
  var session = isSessionValid(sessionExpiry) ? currentSession : setSession();

  var inTracking = function() {
    this.init = function(obj) {
      eventType = obj.eventType;
      trackingObj = Object.assign({}, trackingObj, obj.data);
    };
    this.push = function(obj) {
      // to get valid session after 30 min or day change
      var mysession = isSessionValid(sessionExpiry) ? session : setSession();
      mysession = new Date(mysession).getTime();
      let postURL = "";
      const eventType = obj.eventType.toLowerCase();
      if(eventType === "profile_without_accesstoken"){
        postURL = `${codeBase}/jsapi/ch/profile`;
        /* doing this only in case on profile creation on agent portal ,
        please don't mess it up */
        setCookie("uuid", "");
        uuid = generateUUID();
        
      }
      else if (eventType === "profile") {
        if (getAccessToken()) {
          postURL = `${codeBase}/jsapi/ch/profile`;
        }
      } else {
        if (getAccessToken()) {
          postURL = `${codeBase}/jsapi/ch/event`;
        } else {
          postURL = `${codeBase}/jsapi/instrument/event`;
        }
      }

      const pushObject = Object.assign({}, obj.data, {
        sessionId: mysession,
        url: location.pathname
      });

      const currentUserId =
        (Store.getState().commonData &&
          Store.getState().commonData.userDetails &&
          Store.getState().commonData.userDetails.profile.userId) ||
        "";
      if (
        currentUserId !== "" &&
        getCookie("userId") &&
        currentUserId !== getCookie("userId")
      ) {
        setCookie("uuid", "");
        uuid = generateUUID();
      }
      if (currentUserId) {
        document.cookie = `userId=${currentUserId};path=/`;
      }

      if (obj.eventType.toLowerCase() === "click") {
        pushObject.userId = uuid;
      }else if(eventType === "profile_without_accesstoken"){
        pushObject.userId = obj.data.userTags.bigshyft_id;
        pushObject.id = uuid;
      }else {
        pushObject.id = uuid;
      }
      
      updateSession();
      postURL &&
        postData(postURL, pushObject, eventType).then(function() {}).catch(function() {});
    };
  };
  window.inTrack = new inTracking();
})();
