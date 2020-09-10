import getPageFromUrl from "./get-page-from-url";

let lastLocation = null;

const clearPreviousMark = () => {
  const pageName = getPageFromUrl(lastLocation);
  if (pageName) {
    window.__bgperformance.clearMarks(pageName);
  }
};

const clearDirectLandMark = () => {
  if (window.__bgDirectLand) {
    window.__bgDirectLand = false;
    window.__bgperformance.clearMarks("__bgDirectLand");
  }
};

const markPagePerformance = pathname => {
  const pageName = getPageFromUrl(pathname);
  if (pageName) {
    window.__bgperformance.mark(pageName);
  }
};

const pagePerformance = pathname => {
  const isRouteChanged = lastLocation && lastLocation !== pathname;

  // remove direct page load
  if (isRouteChanged) {
    clearPreviousMark();
    clearDirectLandMark();
    markPagePerformance(pathname);
  }

  // setting current path to last location
  lastLocation = pathname;
};

export default pagePerformance;
