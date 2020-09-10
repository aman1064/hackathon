import React, { Component } from "react";
import CompanyDetails from "../../organisms/CompanyDetails";
import ShareLink from "../ShareLink/ShareLink";

export default class JDCompanyDetails extends Component {
  render() {
    const { jobDetails, isKnowMore } = this.props;
    const isExpired =
      jobDetails.status.toLowerCase() === "close" ||
      jobDetails.status.toLowerCase() === "closed";

    return (
      <React.Fragment>
        {!isExpired &&
        !isKnowMore && (
          <div className="shareLinkPosition">
            <ShareLink
              {...this.props}
              jobId={jobDetails.jobId}
              jobTitle={jobDetails.designation}
              className="marginLeft_auto"
              trackerCategory="Public_JD"
            />
          </div>
        )}
        {jobDetails && (
          <CompanyDetails
            jobData={jobDetails}
            customClass="marginTop_16"
            isKnowMore={true}
          />
        )}
        {isExpired && (
          <span className="CompanyDetails__ExpiredLabel">
            This job has expired!
          </span>
        )}
      </React.Fragment>
    );
  }
}
