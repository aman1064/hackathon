import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

import speedometer from "../../../../../assets/images/svg/speedometer.svg";
import correct from "../../../../../assets/images/svg/correct.svg";
import stopWatch from "../../../../../assets/images/svg/stopWatch.svg";
import winner from "../../../../../assets/images/svg/winner.svg";

import "./ThumbStats.scss";

const getPercent = (score, outOf) => {
  let percent = 0;
  if (outOf === 0) {
    return 0;
  }
  if (Number.isInteger(score) && Number.isInteger(outOf)) {
    percent = parseInt((score / outOf) * 100, 10);
  }
  return percent;
};

const ThumbStats = ({
  visits,
  applies,
  assessments,
  interviews,
  totalVisitors
}) => {
  return (
    <div className="ThumbStats">
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={speedometer} alt="icon" />
        <p className="title">Company Booth Visitors</p>
        <p className="score">
          <CountUp end={visits} />{" "}
          <span className="conversion">
            ({getPercent(visits, totalVisitors)}% Conversion)
          </span>
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={correct} alt="icon" />
        <p className="title">User Applies</p>
        <p className="score">
          <CountUp end={applies} />
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={stopWatch} alt="icon" />
        <p className="title">Assesments Done</p>
        <p className="score">
          <CountUp end={assessments} />
        </p>
      </div>
      <div className="ThumbStatsCard">
        <img className="ThumbStatsIcon" src={winner} alt="icon" />
        <p className="title">Users at inteview stage</p>
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
