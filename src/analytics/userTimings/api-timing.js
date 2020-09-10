import { clearMarks } from "./performance-utils";
import tracker from "../tracker";
export default function apiMeasure(markerName) {
    if (!window.performance) return undefined;  
    try {
      const measureName = `API ${markerName}`;
      const measurement = window.performance.measure(measureName, markerName);
      tracker().on("gtm_user_timing", {
        hitName: "apiTimingMeasure",
        timingCategory: measurement.name,
        timingVariable: "API Load",
        timingLabel: measurement.name,
        timingValue: Math.ceil(measurement.duration)
      });
      clearMarks(markerName);
      window.performance.clearMeasures(measureName);
    } catch (error) {
      return error;
    }  return undefined;
  }