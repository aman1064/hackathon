import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "../../../../../ui-components/Button";

import routeConfig from "../../../../../constants/routeConfig";
import { getDHMS } from "../../../../../utils/timeUtils";

import { AlertIcon } from "../../../../atoms/Icon/icons";

import "./DataIncomplete.scss";

const DataIncomplete = ({ testName, contestId, lastAttemptTime }) => {
  const { days } = getDHMS(new Date() - new Date(lastAttemptTime).getTime());

  const daysToRetake = 30 - days > 0 ? 30 - days : 0;

  return (
    <div className="DataIncomplete">
      <AlertIcon size={48} />
      <h2>Your attempt for ‘{testName} Test’ seems to be incomplete</h2>
      {daysToRetake > 0 && (
        <>
          <p className="cooldownTime">
            You can retake this test in {daysToRetake} days
          </p>
          <Button disabled>Retake this test</Button>
        </>
      )}
      {daysToRetake === 0 && (
        <Link to={routeConfig.practiceContest.replace(":contestId", contestId)}>
          <Button>Retake this test</Button>
        </Link>
      )}
    </div>
  );
};

DataIncomplete.propTypes = {
  testName: PropTypes.string.isRequired,
  contestId: PropTypes.string.isRequired,
  lastAttemptTime: PropTypes.string.isRequired
};

DataIncomplete.defaultProps = {};

export default DataIncomplete;
