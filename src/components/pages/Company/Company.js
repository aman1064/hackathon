import React, { Component } from "react";
import { Link } from "react-router-dom";

import CollectionCard from "../../templates/CollectionCard";
import LogoHeader from "../../organisms/LogoHeader";
import Loading from "../../atoms/Loading";

import Urls from "../../../constants/Urlconfig";
import servives from "../../../utils/services";
import routeConfig from "../../../constants/routeConfig";

import "./Company.scss";
import Button from "../../../ui-components/Button";

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyData: null,
      companyId: props.match.params.id
    };
  }

  componentDidMount() {
    const url = Urls.getLandingLogo;
    const { companyId } = this.state;
    const postobj = {
      query: `{ getCompanyPage(id: ${companyId}){id,companyName,companyLogoUrl,aboutCompany,companyLocation,companySize,companyType,companyFinancials,companyWebsiteUrl,companyVideoUrl,jobs{jobId,designation,cities,matchDetails,jobDescription,aboutCompany,companyLocation,companySize,companyType,companyFinancials,companyLogoUrl,companyWebsiteURL,minCTC,maxCTC,minExperience,maxExperience,benefits,empType,jobRole,ctcConfidential,contestId,assessed,assessmentPassed,eligibleForInterview,interviewRoomId, shownInterest},recruiters{recId, recName,recEmail}} }`
    };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        this.setState({ companyData: res.data.getCompanyPage });
      }
    });
  }

  applyOnJob = (jobId, index, loaderReset) => {
    const url = Urls.getLandingLogo;
    const { companyId, companyData } = this.state;
    const postobj = {
      query: `mutation {markJobInterested(companyId:"${companyId}",jobId:"${jobId}")}`  };
    servives.post(url, postobj).then(res => {
      if (res.data) {
        let jobs = companyData.jobs;
        jobs[index] = {...jobs[index], shownInterest: true};
        this.setState({companyData: {...companyData}})
      }
    }).finally(() => {
      loaderReset(false);
    });
  }

  render() {
    const { companyData } = this.state;
    const { userName, history } = this.props;
    if (!companyData) {
      return <Loading />;
    }
    return (
      <div className="Company">
        <div className="LogoHeaderCntnr">
          <LogoHeader redirectLink={routeConfig.home}>
            <div className="LogoHeaderLinks">
              <div className="linkItem">
                <Link to={routeConfig.home}>Job Fair</Link>
              </div>
              <div className="linkItem">
                <Link
                  to={routeConfig.companyAnalytics.replace(
                    ":id",
                    companyData.id
                  )}
                >
                  Analytics
                </Link>
              </div>
              <div className="username linkItem">Hi {userName}</div>
            </div>
          </LogoHeader>
        </div>
        <div className="page-container">
          <div className="heading">
            <div className="logoCntnr">
              <a
                href={companyData.companyWebsiteUrl}
                target="_blank"
                className="url-link"
              >
                <img
                  src={companyData.companyLogoUrl}
                  alt={companyData.companyName}
                />
              </a>
            </div>
            <div className="companyNameCntnr">
              <h1>{companyData.companyName}</h1>
              <p className="desc">
                is{" "}
                {companyData.companySize && (
                  <span>
                    a <span className="bold">{companyData.companySize}</span>{" "}
                    company{" "}
                  </span>
                )}
                {companyData.companyLocation && (
                  <span>
                    having Headquarter at{" "}
                    <span className="bold">
                      {companyData.companyLocation
                        .replace("HQ : ", "")
                        .replace("HQ:", "")}
                    </span>
                  </span>
                )}
              </p>
            </div>
            <div className="recChat">
              <Button className="recChatBtn" appearance="secondary" onClick={() =>
                  location.replace(`https://nishulk.com/#/recruiter-personal-${companyData.recruiters[0].recId}`)
              }>
                Chat with Recruiter
              </Button>
              <p>
                Ask more about the job role from{" "}
                <span className="capitalize">
                  {(companyData.recruiters &&
                    companyData.recruiters[0].recName) ||
                    "Recruiter"}
                </span>
              </p>
            </div>
          </div>

          <h2 className="openHeading">
            Open positions at {companyData.companyName}
          </h2>
          <div className="jobs-grp">
            {companyData.jobs.map((job, renderIndex) => {
              return (
                <CollectionCard
                  key={job.jobId}
                  jobDetails={job}
                  renderIndex={renderIndex}
                  companyName={companyData.companyName}
                  history={history}
                  applyOnJob={this.applyOnJob}
                />
              );
            })}
          </div>
          <h2 className="openHeading">About {companyData.companyName}</h2>
          <div
            className="about-company"
            dangerouslySetInnerHTML={{
              __html: companyData.aboutCompany
            }}
          />

          <div className="video-container">
            <iframe
              className="video-frame"
              key={companyData.companyVideoUrl}
              height="500"
              src={`${companyData.companyVideoUrl}`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Company;
