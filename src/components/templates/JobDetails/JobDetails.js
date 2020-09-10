import React, { PureComponent } from "react";

import TextCard from "../TextCard";
import getKey from "../../../utils/getKey";
import { IconListItem, ListItem } from "../../atoms/ListItem";
import ReadMore from "../../organisms/ReadMore";

import "../../pages/Jobs/Jobs.scss";
import tracker from "../../../analytics/tracker";

const getAboutCompany = (aboutCompany, trackerCategory, jobId) => {
  const displayData = aboutCompany.map(({ name, value, action }) => {
    if (value) {
      return (
        <div className="marginBottom_28 fontSize_13" key={getKey()}>
          <p className=" bold marginBottom_8">{name}</p>
          {name === "Website" ? (
            <a
              onClick={() => {
                tracker().on("event", {
                  hitName: `${trackerCategory ||
                    "browse"}$company_url_clicked$detailed_jd$${jobId}`
                });
              }}
              href={value.includes("http") ? value : `//${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="KnowMore__companyUrl"
            >
              {value}
            </a>
          ) : (
            <ReadMore
              str={value}
              displayChars={150}
              trackerCategory={trackerCategory || "browse"}
              trackerAction={action}
              trackerLabel="detailed_jd"
              trackerValue={jobId}
            />
          )}
        </div>
      );
    } else {
      return null;
    }
  });
  return displayData;
};

const getMatchDetails = jobDetails => {
  return jobDetails.matchDetails &&
    jobDetails.matchDetails.length > 0 &&
    Array.isArray(jobDetails.matchDetails) ? (
    <TextCard
      config={{
        customClass: "marginBottom_15",
        headerText: "Why this job may interest you",
        wrapperClass: "jdMarketingMsg"
      }}
      name="matchDetails"
    >
      {jobDetails.matchDetails.map(data => (
        <IconListItem
          size={12}
          key={getKey()}
          iconName="CheckedActive"
          description={data}
          customClass="textIndent fontSize_13"
        />
      ))}
    </TextCard>
  ) : (
    ""
  );
};

const getJobDescription = jobDetails => {
  return jobDetails.jobDescription ? (
    <TextCard
      config={{
        customClass: "marginBottom_15",
        headerText: "Job Description",
        wrapperClass: "KnowMore__JDWrapper"
      }}
      name="jobDescription"
    >
      <div
        className="fontSize_13"
        dangerouslySetInnerHTML={{
          __html: jobDetails.jobDescription
        }}
      />
    </TextCard>
  ) : (
    ""
  );
};

const getAdditionalBenefits = jobDetails => {
  return jobDetails.benefits &&
    jobDetails.benefits.length > 0 &&
    Array.isArray(jobDetails.benefits) ? (
    <TextCard
      config={{
        customClass: "marginBottom_15",
        headerText: "Additional benefits"
      }}
      name="benefits"
    >
      <ul className="themedUl fontSize_13">
        {jobDetails.benefits.map(data => (
          <ListItem key={getKey()} description={data} />
        ))}
      </ul>
    </TextCard>
  ) : (
    ""
  );
};

const getCompanyDetails = (jobDetails, aboutCompany, trackerCategory) => {
  return jobDetails.companyName && jobDetails.aboutCompany ? (
    <TextCard
      config={{
        wrapperClass: "KnowMore__aboutComp",
        customClass: "marginBottom_12",
        headerText: `About ${jobDetails.companyName}`
      }}
      name="aboutCompany"
    >
      <div
        className="marginBottom_28 fontSize_13 "
        dangerouslySetInnerHTML={{
          __html: jobDetails.aboutCompany
        }}
      />
      {aboutCompany &&
        getAboutCompany(aboutCompany, trackerCategory, jobDetails.jobId)}
    </TextCard>
  ) : (
    ""
  );
};

const getTeamSize = jobDetails => {
  return jobDetails.teamSize ? (
    <TextCard
      config={{
        customClass: "marginBottom_15",
        headerText: "Team Size",
        wrapperClass: "KnowMore__JDWrapper"
      }}
      name="teamSize"
    >
      <div className="fontSize_13">{`${jobDetails.teamSize} employees`}</div>
    </TextCard>
  ) : (
    ""
  );
};

export default class JobDetails extends PureComponent {
  render() {
    const { jobDetails, aboutCompany, className, trackerCategory } = this.props;
    return (
      <div className={className}>
        {getMatchDetails(jobDetails)}
        {getJobDescription(jobDetails)}
        {getTeamSize(jobDetails)}
        {getAdditionalBenefits(jobDetails)}
        {getCompanyDetails(jobDetails, aboutCompany, trackerCategory)}
      </div>
    );
  }
}
