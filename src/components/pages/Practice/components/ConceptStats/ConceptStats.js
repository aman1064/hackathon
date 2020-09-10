import React from "react";
import PropTypes from "prop-types";
import CountUp from "react-countup";

import ProgressBar from "../../../../../ui-components/ProgressBar";
import Chip from "../../../../../ui-components/Chip";

import "./ConceptStats.scss";

const PROGRESSBAR_COLORS = ["#c6b9f1", "#f8b5b5", "#b7dcfd", "#ffd769"];

const getPercent = (score, outOf) => {
  let percent = 0;
  if (Number.isInteger(score) && Number.isInteger(outOf)) {
    percent = parseInt((score / outOf) * 100, 10);
  }
  return percent;
};

const ConceptStats = React.forwardRef(
  ({ chartingData, strength, weakness, isInViewport }, ref) => (
    <div className="ConceptStats">
      <h2>Concept based analysis</h2>
      <div className="chartsCntnr" ref={ref}>
        {Object.keys(chartingData).map((topic, index) => (
          <div className="chart" key={topic}>
            <div className="chartHeading">
              <p className="chartName">{topic}</p>
              <p className="chartScore">
                {isInViewport ? (
                  <CountUp end={chartingData[topic].correctQuestions} />
                ) : (
                  0
                )}{" "}
                /{chartingData[topic].totalQuestions} Correct
              </p>
            </div>
            <ProgressBar
              color={PROGRESSBAR_COLORS[index % 4]}
              complete={
                isInViewport
                  ? getPercent(
                      chartingData[topic].correctQuestions,
                      chartingData[topic].totalQuestions
                    )
                  : 0
              }
            />
          </div>
        ))}
      </div>
      <div className="topicsCntnr">
        {strength && strength.length > 0 && (
          <div className="plus">
            <h3>Your Strengths</h3>
            <div className="plusChips">
              {strength.map(topic => (
                <Chip key={topic} label={topic} />
              ))}
            </div>
          </div>
        )}
        {weakness && weakness.length > 0 && (
          <div className="minus">
            <h3>Areas to improve upon</h3>
            <div className="minusChips">
              {weakness.map(topic => (
                <Chip key={topic} label={topic} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
);

ConceptStats.propTypes = {
  chartingData: PropTypes.object.isRequired,
  strength: PropTypes.array,
  weakness: PropTypes.array,
  isInViewport: PropTypes.bool
};

ConceptStats.defaultProps = {
  strength: null,
  weakness: null,
  isInViewport: false
};

export default ConceptStats;
