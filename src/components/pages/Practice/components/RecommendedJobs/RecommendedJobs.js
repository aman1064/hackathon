import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import RecommendedJobsShimmer from "./RecommendedJobsShimmer";

import { getExpStr, getPackageStr } from "../../../../../utils/jobDetailsUtils";
import { getPublicJdURL } from "../../../../../utils/getUrl";

import logoSmallCovid from "../../../../../assets/images/svg/logo_small_covid.svg";

import "./RecommendedJobs.scss";

class RecommendedJobs extends PureComponent {
  componentDidMount() {
    const { getRecommendedJobs, groupId } = this.props;
    if (groupId) {
      this.groupId = groupId;
      getRecommendedJobs(groupId);
    }
  }

  componentDidUpdate() {
    const { getRecommendedJobs, groupId } = this.props;
    if (this.groupId && groupId !== this.groupId) {
      this.groupId = groupId;
      getRecommendedJobs(groupId);
    }
  }

  render() {
    const { recommendedJobs, queryParams } = this.props;
    return (
      <div className="RecJobs">
        <img
          className="bigshyftLogo"
          src={logoSmallCovid}
          alt="BigShyft logo"
        />
        <h2>Work with a top Tech Company</h2>
        <p className="RecJobsDesc">Boost your career’s full potential</p>
        <div className="RecJobsList">
          {recommendedJobs.isLoading && <RecommendedJobsShimmer />}
          {recommendedJobs.data &&
            recommendedJobs.data.map(job => (
              <Link
                key={job.jobId}
                to={`${getPublicJdURL(job.jobId, job.designation)}${
                  queryParams ? `${queryParams}&contest=true` : "?contest=true"
                }`}
              >
                <div className="RecJobsCard" key={job.jobId}>
                  <div className="logoCntnr">
                    <img
                      className="logo"
                      src={job.companyLogoUrl}
                      alt="company logo"
                    />
                  </div>
                  <h3 className="title">{job.designation}</h3>
                  <p className="company">{job.companyName}</p>
                  <p className="location">{job.cities.join(", ")}</p>
                  <div className="details">
                    <p className="exp">
                      <span className="data">
                        {getExpStr({
                          minExp: job.minExperience,
                          maxExp: job.maxExperience,
                          suffix: "yrs"
                        })}
                      </span>
                      <span className="placeholder">Experience</span>
                    </p>
                    {!job.maxCTC ? (
                      <p className="salary isConfidential">
                        <span className="placeholder">
                          Salary is confidential
                        </span>
                      </p>
                    ) : (
                      <p className="salary">
                        <span className="data">
                          {getPackageStr({
                            minCtc: job.minCTC,
                            maxCtc: job.maxCTC,
                            repeatSuffix: "L"
                          })}
                        </span>
                        <span className="placeholder">Salary</span>
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    );
  }
}

RecommendedJobs.propTypes = {
  getRecommendedJobs: PropTypes.func.isRequired,
  groupId: PropTypes.string.isRequired,
  recommendedJobs: PropTypes.object,
  queryParams: PropTypes.string
};

RecommendedJobs.defaultProps = {
  recommendedJobs: { data: null, isError: false, isLoading: false },
  queryParams: ""
};

export default RecommendedJobs;
