import { idleTime } from "./performance-utils";
import tracker from "../tracker";
import isMobileDevice from "../../utils/isMobileDevice";

function getScriptResources(enteries) {
  const regex = /\.chunk\.js$/;
  const mainRegex = /\main\.[0-9a-z]{8}\.js$/;
  const scriptTags = ["script", "link"];
  return (enteries || [])
    .filter(
      entry =>
        scriptTags.includes(entry.initiatorType) &&
        (regex.test(entry.name) || mainRegex.test(entry.name))
    );
}
function getStyleResources(enteries) {
  const regex = /\.chunk\.css$/;
  const mainRegex = /\main\.[0-9a-z]{8}\.css$/;
  const scriptTags = ["link"];
  return (enteries || [])
    .filter(
      entry =>
        scriptTags.includes(entry.initiatorType) &&
        (regex.test(entry.name) || mainRegex.test(entry.name))
    );
}
function getLoadTime(entry) {
  return Math.ceil(entry.responseEnd - entry.startTime);
}
function getResourceDetails(url) {
  const details = {};
  const splits = (url || "").split("/");
  if (splits.length > 0) {
    const lastElement = splits[splits.length - 1] || "";
    const lastElementSplits = lastElement.split(".");
    if (lastElementSplits.length > 0) {
      const extension = lastElementSplits[lastElementSplits.length - 1];
      details.type = extension;
      details.name = `${lastElementSplits[0] || ""}`;
    }
  }
  return details;
}
function getEnteries(type) {
  if (!window.performance) return {};
  const resourceList = window.performance.getEntriesByType("resource");
  let items = [];
  switch (type) {
    case "js":
      items = getScriptResources(resourceList);
      break;
    case "css":
      items = getStyleResources(resourceList);
      break;
    default:
      break;
  }
  const toSync = {};
  if (items.length > 0) {
    items.forEach(entry => {
      toSync[entry.name] = {
        loadTime: getLoadTime(entry),
        ...getResourceDetails(entry.name)
      };
    });
  }
  return toSync;
}
function resourceMeasure() {
  const toSync = { ...getEnteries("js"), ...getEnteries("css") };
  const deviceName = isMobileDevice() ? "Mobile" : "Desktop";
  if (Object.keys(toSync).length > 0) {
    idleTime(() => {
      Object.keys(toSync).forEach(entry => {
        idleTime(() =>
          tracker().on("gtm_user_timing", {
            hitName: "resourceTimingMeasure",
            timingCategory: `${toSync[entry].name}.${deviceName}.${toSync[entry]
              .type}`,
            timingVariable: `${toSync[entry].type.toUpperCase()} Load`,
            timingLabel: `${toSync[entry].name}.${toSync[entry].type}`,
            timingValue: toSync[entry].loadTime
          })
        );
      });
    });
  }
}
export default resourceMeasure;
