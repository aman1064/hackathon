export const clearMarks = (...args) => {
    if (window.performance) {
      window.performance.clearMarks(...args);
    }
  };
export const getByName = markerName => {
    try {
      if (window.performance) {
        return window.perfromance.getEntriesByName(markerName || "");
      }
    } catch (_e) {
      return [];
    }  return [];
  };
  export const mark = markerName => {
    if (window.performance) {
      clearMarks(markerName);
      window.performance.mark(markerName);
    }
  };
  export const idleTime = window.requestIdleCallback || setTimeout;