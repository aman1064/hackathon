import React from "react";
import PropTypes from "prop-types";

import PercentBar from "../../../../../ui-components/PercentBar";

import { UpArrowIcon, DownArrowIcon } from "../../../../atoms/Icon/icons";

import "./ComparisonStats.scss";

const getPercent = (score, outOf) => {
  let percent = 0;
  if (Number.isInteger(score) && Number.isInteger(outOf)) {
    percent = parseInt((score / outOf) * 100, 10);
  }
  return percent;
};

const renderTitle = (isSelfComparison, isTopper) => {
  let title = "You vs. the Topper";
  if (isSelfComparison) {
    title = "Comparison from last attempt";
  } else if (isTopper) {
    title = "You are the Topper";
  }
  return title;
};

const ComparisonStats = React.forwardRef(
  (
    {
      userAttempt,
      topperAttempt,
      selectedContest,
      isInViewport,
      isSelfComparison
    },
    ref
  ) => {
    const selfScorePC = getPercent(
      userAttempt.totalScore,
      selectedContest.totalScore
    );
    const topperScorePC = getPercent(
      topperAttempt.totalScore,
      selectedContest.totalScore
    );
    const selfTimePC = getPercent(
      parseInt(userAttempt.timeTaken / 1000, 10),
      parseInt(selectedContest.duration / 1000, 10)
    );
    const topperTimePC = getPercent(
      parseInt(topperAttempt.timeTaken / 1000, 10),
      parseInt(selectedContest.duration / 1000, 10)
    );
    const selfAccuracyPC = getPercent(
      userAttempt.totalCorrectQuestions,
      userAttempt.totalQuestionsAttempted
    );
    const topperAccuracyPC = getPercent(
      topperAttempt.totalCorrectQuestions,
      topperAttempt.totalQuestionsAttempted
    );
    const isTopper = !isSelfComparison && !userAttempt.index;
    return (
      <div
        className={`ComparisonStats ${
          isSelfComparison ? "isSelfComparison" : ""
        }`}
        ref={ref}
        id="comparisonStats"
      >
        <div className="legendsCntnr">
          <h2>{renderTitle(isSelfComparison, isTopper)}</h2>
          {!isTopper && (
            <div className="legend">
              <span className="self">
                {isSelfComparison ? "Last attempt" : "You"}
              </span>
              <span className="from">
                {isSelfComparison ? "Current attempt" : "The Topper"}
              </span>
            </div>
          )}
        </div>

        <div className="chartCntnr">
          <div className="keys">
            <p className="label">
              Score{" "}
              {isSelfComparison ? (
                <span
                  className={
                    topperScorePC < selfScorePC ? "decrease" : "increase"
                  }
                >
                  {Math.abs(topperScorePC - selfScorePC)}%
                  {topperScorePC < selfScorePC ? (
                    <DownArrowIcon size={10} />
                  ) : (
                    <UpArrowIcon size={10} />
                  )}
                </span>
              ) : (
                "(%)"
              )}
            </p>
            <p className="label">
              Time taken{" "}
              {isSelfComparison ? (
                <span
                  className={
                    topperTimePC > selfTimePC ? "decrease" : "increase"
                  }
                >
                  {Math.abs(topperTimePC - selfTimePC)}%
                  {topperTimePC > selfTimePC ? (
                    <DownArrowIcon size={10} />
                  ) : (
                    <UpArrowIcon size={10} />
                  )}
                </span>
              ) : (
                "(%)"
              )}
            </p>
            <p className="label">
              Accuracy{" "}
              {isSelfComparison ? (
                <span
                  className={
                    topperAccuracyPC < selfAccuracyPC ? "decrease" : "increase"
                  }
                >
                  {Math.abs(topperAccuracyPC - selfAccuracyPC)}%
                  {topperAccuracyPC < selfAccuracyPC ? (
                    <DownArrowIcon size={10} />
                  ) : (
                    <UpArrowIcon size={10} />
                  )}
                </span>
              ) : (
                "(%)"
              )}
            </p>
          </div>
          <div className={`diagram ${isTopper ? "isTopper" : ""}`}>
            <div className="barsCntnr score">
              <PercentBar
                percent={isInViewport ? selfScorePC : 0}
                color={isSelfComparison ? "#ddeffe" : "#abd6fc"}
              />
              {!isTopper && (
                <PercentBar
                  percent={isInViewport ? topperScorePC : 0}
                  color={isSelfComparison ? "#abd6fc" : "#ffd769"}
                />
              )}
            </div>
            <div className="barsCntnr time">
              <PercentBar
                percent={isInViewport ? selfTimePC : 0}
                color={isSelfComparison ? "#ddeffe" : "#abd6fc"}
              />
              {!isTopper && (
                <PercentBar
                  percent={isInViewport ? topperTimePC : 0}
                  color={isSelfComparison ? "#abd6fc" : "#ffd769"}
                />
              )}
            </div>
            <div className="barsCntnr accuracy">
              <PercentBar
                percent={isInViewport ? selfAccuracyPC : 0}
                color={isSelfComparison ? "#ddeffe" : "#abd6fc"}
              />
              {!isTopper && (
                <PercentBar
                  percent={isInViewport ? topperAccuracyPC : 0}
                  color={isSelfComparison ? "#abd6fc" : "#ffd769"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ComparisonStats.propTypes = {
  userAttempt: PropTypes.object.isRequired,
  topperAttempt: PropTypes.object.isRequired,
  selectedContest: PropTypes.object.isRequired,
  isInViewport: PropTypes.bool.isRequired,
  isSelfComparison: PropTypes.bool
};

ComparisonStats.defaultProps = {
  isSelfComparison: false
};

export default ComparisonStats;
