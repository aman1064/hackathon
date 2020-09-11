import React, {useState} from "react";
import PropTypes from "prop-types";
import {getExpStr, getPackageStr} from "../../../utils/jobDetailsUtils";
import getKey from "../../../utils/getKey";
import SpanWithIcon from "../../molecules/SpanWithIcon";
import "./CollectionCard.scss";
import Button from "../../../ui-components/Button";
import {CTA_TYPE, findCTA} from "./util";

const CollectionCard = ({ jobDetails, companyName, applyOnJob, renderIndex, history }) => {
    const [loading, setLoading] = useState(false);
    const primaryCTA = findCTA(jobDetails);

    const handlePrimaryCTA = () => {
        const ctaValue = primaryCTA.value
        switch (ctaValue) {
            case CTA_TYPE.APPLY.value:
                setLoading(true);
                applyOnJob(jobDetails.jobId, renderIndex, setLoading)
                break;

            case CTA_TYPE.ASSESSMENT.value:
                history.push(`/practice/contest/${jobDetails.contestId}`, {
                    jobDetails: jobDetails
                })
                break;

            case CTA_TYPE.INTERVIEW.value:
                history.push(`/#/${jobDetails.interviewRoomId}`);
                location.reload();
                break;
            default:
                return null;
        }
    }

  return (
      <div className="CollectionCard">
          <div className="card-details">
            <div className="logoWrapper">
              <img
                className="companyLogo"
                src={jobDetails.companyLogoUrl}
                alt="company logo"
              />
            </div>

            <div className="cardContent">
          <h4>{jobDetails.designation}</h4>
          <h5>{companyName}</h5>
          <div className="jobDetails">
            <span className="cities">{jobDetails.cities.join(", ")}</span>
            <hr className="hideInM detailsSep" />
            <span className="experience">
              {getExpStr({
                minExp: jobDetails.minExperience,
                maxExp: jobDetails.maxExperience
              })}
            </span>
            <hr className="detailsSep" />
            <span
              className={`salary ${
                jobDetails.maxCTC === 0 ? "isConfidential" : ""
              }`}
            >
              {jobDetails.maxCTC === 0
                ? `Salary is confidential`
                : getPackageStr({
                    minCtc: jobDetails.minCTC,
                    maxCtc: jobDetails.maxCTC
                  })}
            </span>
          </div>
          {jobDetails.matchDetails.length > 0 && (
            <div className="marketingMessage">
              <h6 className="messageHeading">Why you may want to apply</h6>
              <ul className="messageList">
                {jobDetails.matchDetails.map((el, index) => (
                  <li key={index} className="messageItem">
                    <SpanWithIcon
                      key={getKey()}
                      iconClass="checkedIcon"
                      icon="CheckedActive"
                      text={el}
                      iconSize={12}
                      viewBox="0 -4 24 24"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
          </div>
        <div className="action-btn-grp">
            <Button
                className=""
                onClick={() => {
                    const winRef = window.open(`${location.pathname}/${jobDetails.jobId}`);
                    jobDetails.companyName = companyName;
                    winRef.data = jobDetails;
                }}
                appearance="secondary"
                type="button"
                size="small"
            >
                Know More
            </Button>
            {primaryCTA.label &&
                <Button
                    className=""
                    loading={loading}
                    onClick={handlePrimaryCTA}
                    appearance="primary"
                    type="button"
                    size="small"
                >
                    {primaryCTA.label}
                </Button>
            }
        </div>
          {primaryCTA.msg && (<span>{primaryCTA.msg}</span>)}
      </div>
  );
};

CollectionCard.propTypes = {
  queryParams: PropTypes.string,
  jobDetails: PropTypes.object.isRequired,
};

CollectionCard.defaultProps = {
  queryParams: null
};

export default CollectionCard;
