import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

import speedometer from "../../../../../assets/images/svg/speedometer.svg";
import correct from "../../../../../assets/images/svg/correct.svg";
import stopWatch from "../../../../../assets/images/svg/stopWatch.svg";
import winner from "../../../../../assets/images/svg/winner.svg";

import "./AttemptStats.scss";

const getMinSec = sec => {
  const min = Math.floor(sec / 60);
  const remSec = sec - min * 60;
  return { min, sec: remSec };
};

const AttemptStats = ({ userAttempt, selectedContest, showUserInsights }) => {
  const { min: attemptMin, sec: attemptSec } = getMinSec(
    parseInt(((userAttempt && userAttempt.timeTaken) || 0) / 1000, 10)
  );
  return (
    <div className="attemptStats">
      <div className="attemptStatsCard">
        <img className="attemptStatsIcon" src={speedometer} alt="icon" />
        <p className="title">Your Score</p>
        <p className="score">
          {showUserInsights ? <CountUp end={userAttempt.totalScore} /> : "NA"}
        </p>
      </div>
      <div className="attemptStatsCard">
        <img className="attemptStatsIcon" src={correct} alt="icon" />
        <p className="title">Correct Responses</p>
        <p className="score">
          {showUserInsights ? (
            <>
              <CountUp end={userAttempt.totalCorrectQuestions} />/
              {selectedContest.totalQuestions}{" "}
            </>
          ) : (
            "NA"
          )}
        </p>
      </div>
      <div className="attemptStatsCard">
        <img className="attemptStatsIcon" src={stopWatch} alt="icon" />
        <p className="title">Time Taken</p>
        <p className="score">
          {showUserInsights ? (
            <>
              <CountUp end={attemptMin} />m <CountUp end={attemptSec} />s
            </>
          ) : (
            "NA"
          )}
        </p>
      </div>
      <div className="attemptStatsCard">
        <img className="attemptStatsIcon" src={winner} alt="icon" />
        <p className="title">Your Rank</p>
        <p className="score">
          {showUserInsights ? (
            <>
              #<CountUp end={userAttempt.index + 1} />
            </>
          ) : (
            "NA"
          )}
        </p>
      </div>
    </div>
  );
};

AttemptStats.propTypes = {
  userAttempt: PropTypes.object.isRequired,
  selectedContest: PropTypes.object.isRequired,
  showUserInsights: PropTypes.bool
};

AttemptStats.defaultProps = {
  showUserInsights: true
};

export default AttemptStats;
