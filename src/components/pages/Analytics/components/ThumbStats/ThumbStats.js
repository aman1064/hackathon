import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

import speedometer from "../../../../../assets/images/svg/speedometer.svg";
import correct from "../../../../../assets/images/svg/correct.svg";
import stopWatch from "../../../../../assets/images/svg/stopWatch.svg";
import winner from "../../../../../assets/images/svg/winner.svg";

import "./ThumbStats.scss";

const ThumbStats = ({ visits, applies, assessments, interviews }) => {
  return (
    <div className="ThumbStats">
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={speedometer} alt="icon" />
        <p className="title">Number of Visits</p>
        <p className="score">
          <CountUp end={visits} />
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={correct} alt="icon" />
        <p className="title">Applies</p>
        <p className="score">
          <CountUp end={applies} />
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={stopWatch} alt="icon" />
        <p className="title">Assessments</p>
        <p className="score">
          <CountUp end={assessments} />
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={winner} alt="icon" />
        <p className="title">Interviews</p>
        <p className="score">
          <CountUp end={interviews} />
        </p>
      </div>
    </div>
  );
};

ThumbStats.propTypes = {
  userAttempt: PropTypes.object.isRequired,
  selectedContest: PropTypes.object.isRequired,
  showUserInsights: PropTypes.bool
};

ThumbStats.defaultProps = {
  showUserInsights: true
};

export default ThumbStats;