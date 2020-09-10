import React from "react";
import PropTypes from "prop-types";
import {getExpStr, getPackageStr} from "../../../utils/jobDetailsUtils";
import {getPublicJdURL} from "../../../utils/getUrl";
import getKey from "../../../utils/getKey";
import SpanWithIcon from "../../molecules/SpanWithIcon";
import "./CollectionCard.scss";
import Button from "../../../ui-components/Button";

const CollectionCard = ({ jobDetails }) => {
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
          <h5>{jobDetails.companyName}</h5>
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
                onClick={() => window.open(
                    getPublicJdURL(jobDetails.jobId, jobDetails.designation)
                )}
                appearance="secondary"
                type="button"
                size="small"
            >
                Know More
            </Button>
          <Button
              className=""
              // onClick={undefined}
              appearance="primary"
              type="button"
              size="small"
          >
            Send Link
          </Button>
        </div>
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
