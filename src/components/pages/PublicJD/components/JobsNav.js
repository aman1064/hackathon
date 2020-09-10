import React from "react";
import { Link } from "react-router-dom";

import routeConfig from "../../../../constants/routeConfig";

const JobsNav = ({
  jobsArr,
  currentJobIndex,
  otherUrlParam,
  loadJobDetails,
  accessToken
}) => {
  const isLoggedIn = accessToken,
    isLastJob = currentJobIndex === jobsArr.length - 1,
    moreJobsUrl = isLoggedIn ? routeConfig.jobs : routeConfig.signup;
  return (
    <div className="JobsNav">
      <Link
        className={`JobsNav__Link ${currentJobIndex ? "" : "isDisabled"}`}
        to={`${routeConfig.publicJD
          .replace(":jobId", jobsArr[currentJobIndex - 1])
          .replace(":other", otherUrlParam)}?jobs=${jobsArr.toString()}`}
        onClick={() => loadJobDetails(jobsArr[currentJobIndex - 1], "previous")}
      >
        Previous Job
      </Link>
      <Link
        className="JobsNav__Link"
        to={
          isLastJob ? (
            moreJobsUrl
          ) : (
            `${routeConfig.publicJD
              .replace(":jobId", jobsArr[currentJobIndex + 1])
              .replace(":other", otherUrlParam)}?jobs=${jobsArr.toString()}`
          )
        }
        onClick={
          isLastJob ? (
            undefined
          ) : (
            () => loadJobDetails(jobsArr[currentJobIndex + 1], "next")
          )
        }
      >
        {isLastJob ? "View more jobs" : "Next Job"}
      </Link>
      <p className="JobsNav__JobCount">
        Job {currentJobIndex + 1}/{jobsArr.length}
      </p>
    </div>
  );
};

export default JobsNav;
