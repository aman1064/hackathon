
import { clearMarks } from "./performance-utils";
import getPageFromUrl from "../../utils/get-page-from-url";
import isMobileDevice from "../../utils/isMobileDevice";
import tracker from "../tracker";
export default function pageMeasure() {

    const pageName = getPageFromUrl();
    if(!pageName) return null;
  
    try {
      const deviceName = isMobileDevice() ? 'Mobile' : 'Desktop';
  
      if (window.performance) {
  
        let measurement = null;
        let measureName = null;
  
        if (window.__bgDirectLand) {
          window.__bgDirectLand = false;
          measureName = `${pageName} Direct Land ${deviceName}`;
          measurement = window.performance.measure(measureName, "__bgDirectLand");
          clearMarks("__bgDirectLand");
        } else {
          measureName = `${pageName} Route Change ${deviceName}`;
          measurement = window.performance.measure(measureName, pageName);
        }
  
        if (measurement) {
          const payload = {
            timingCategory: measurement.name,
            timingVariable: "Page Load",
            timingLabel: measurement.name,
            timingValue: Math.ceil(measurement.duration)
          };
  
          tracker().on("gtm_user_timing", {
            ...payload
          });
  
          clearMarks(pageName);
          window.performance.clearMeasures(measureName);
        }
      }
    } catch (error) {
      clearMarks(pageName);
      return error;
    }
  
    return null;
  }