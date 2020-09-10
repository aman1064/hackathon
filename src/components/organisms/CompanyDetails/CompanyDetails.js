import React, { Component } from "react";
import { prependZero } from "../../../utils/pureFns";

import CompanyDetailsItem from "./CompanyDetailsItem";
import PageHeading from "../../atoms/PageHeading";
import CompanyLogo from "./CompanyLogo";
import Loading from "../../atoms/Loading";
import "./CompanyDetails.scss";

const getCtcStr = value => {
  if (value > 10 && value < 10000000) {
    value = `${value / 100000}L`;
  } else if (value >= 10000000) {
    value = `${value / 10000000}Cr`;
  } else {
    value = `${value}L`;
  }
  return value;
};

const getPackageStr = (minCtc, maxCtc) => {
  return `${getCtcStr(minCtc)} - ${getCtcStr(maxCtc)}`;
};

const getEquityStr = (minEq, maxEq) => `${minEq}% - ${maxEq}% equity`;

const getAlumniStr = numberOfAlumni => {
  return `${prependZero(numberOfAlumni)} alumni work here`;
};

const getExpStr = (minExp, maxExp) => {
  return `${minExp}-${maxExp} yrs`;
};

class CompanyDetails extends Component {
  render() {
    const { jobData, customClass, isKnowMore, isJobCard } = this.props;
    return jobData ? (
      <div className={`CompanyDetails ${customClass}`}>
        <div className="CompanyDetails__logo">
          <CompanyLogo
            companyName={jobData.companyName}
            src={jobData.companyLogoUrl}
            name="companyLogo"
          />
        </div>
        <div
          className={`CompanyDetails__name ${
            isKnowMore ? "isKnowMore" : "isSwipeCard"
          }`}
        >
          <PageHeading
            className={`CompanyDetails__jobTitle ${
              isKnowMore ? "" : "ellipsis"
            }`}
            title={jobData.designation}
            el="h2"
          />

          {jobData.companyName && (
            <p className="CompanyDetails__companyName" name="companyName">
              {jobData.companyName}
            </p>
          )}
          {jobData.cities && (
            <p
              className={`CompanyDetails__location ${
                isKnowMore ? "" : "ellipsis"
              }`}
              name="cities"
            >
              {jobData.cities.length > 0 &&
                Array.isArray(jobData.cities) &&
                jobData.cities.join(", ")}
            </p>
          )}
          <div className="CompanyDetails__extraInfo">
            {jobData.minExperience >= 0 && (
              <p className="fontSize_13">
                <span className="bold">
                  {getExpStr(jobData.minExperience, jobData.maxExperience)}
                </span>
                <span className="marginLeft_6">Experience</span>
              </p>
            )}
            {!jobData.ctcConfidential && (
              <p className="fontSize_13 marginLeft_28">
                <span className="bold">
                  {getPackageStr(jobData.minCTC, jobData.maxCTC)}
                </span>
                <span className="marginLeft_6">Salary</span>
              </p>
            )}
            {jobData.ctcConfidential && !isJobCard && (
              <p className="ctcConfidential">Salary is confidential</p>
            )}
          </div>
          {jobData.minEquity && (
            <CompanyDetailsItem
              icon="Share"
              text={getEquityStr(jobData.minEquity, jobData.maxEquity)}
              name="equity"
            />
          )}
          {jobData.numberOfAlumuni && (
            <CompanyDetailsItem
              className="alumniStats"
              text={getAlumniStr(jobData.numberOfAlumuni)}
              name="numberOfAlumuni"
            />
          )}
        </div>
      </div>
    ) : (
      <Loading />
    );
  }
}

export default CompanyDetails;
