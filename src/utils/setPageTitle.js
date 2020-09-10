import { routeMetaInfo } from "../constants/routeConfig";
import { isEmpty } from "./jsUtils";

let prevPath = "";
export default location => {
  const titleConfig = routeMetaInfo[location.pathname];
  if (!isEmpty(titleConfig)) {
    prevPath = location.pathname;
    document.title = titleConfig.title;
  } else if (prevPath && !location.pathname.includes("covid")) {
    // in case there is job card
    prevPath = "";
    document.title =
      "Job Search - Job Vacancy - Recruitment - Job opportunities - bigshyft.com";
  }
};
