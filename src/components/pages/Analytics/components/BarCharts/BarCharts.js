import React, { PureComponent } from "react";

import PercentBar from "../../../../../ui-components/PercentBar";

import "./BarCharts.scss";

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

const BarChartsGroup = ({
  visitsPercent,
  appliesPercent,
  interviewsPercent,
  assessmentsPercent
}) => (
  <div className="barsCntnr score">
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={visitsPercent}
      color="#b7dcfd"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={appliesPercent}
      color="#ffd768"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={interviewsPercent}
      color="#c6b9f1"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={assessmentsPercent}
      color="#f8b5b5"
    />
  </div>
);

class BarCharts extends PureComponent {
  render() {
    const { latest4, processedData } = this.props;
    return (
      <div className="BarCharts">
        <div>
          <div className="legendsCntnr">
            <h2>Time based Analysis in Percentage</h2>
            <div className="legend">
              <span className="visits">Company Booth Visitors</span>
              <span className="applies">User Applies</span>
              <span className="assessments">Assesments Done</span>
              <span className="interviews">Users at inteview stage</span>
            </div>
          </div>

          <div className="chartCntnr">
            <div className="diagram">
              <BarChartsGroup
                visitsPercent={getPercent(
                  processedData.visitors.bars[latest4[0]],
                  processedData.visitors.thumbs || 0
                )}
                appliesPercent={getPercent(
                  processedData.applies.bars[latest4[0]],
                  processedData.visitors.thumbs || 0
                )}
                interviewsPercent={getPercent(
                  processedData.interviews.bars[latest4[0]],
                  processedData.visitors.thumbs || 0
                )}
                assessmentsPercent={getPercent(
                  processedData.assessments.bars[latest4[0]],
                  processedData.visitors.thumbs || 0
                )}
              />
              <BarChartsGroup
                visitsPercent={getPercent(
                  processedData.visitors.bars[latest4[1]],
                  processedData.visitors.thumbs || 0
                )}
                appliesPercent={getPercent(
                  processedData.applies.bars[latest4[1]],
                  processedData.visitors.thumbs || 0
                )}
                interviewsPercent={getPercent(
                  processedData.interviews.bars[latest4[1]],
                  processedData.visitors.thumbs || 0
                )}
                assessmentsPercent={getPercent(
                  processedData.assessments.bars[latest4[1]],
                  processedData.visitors.thumbs || 0
                )}
              />
              <BarChartsGroup
                visitsPercent={getPercent(
                  processedData.visitors.bars[latest4[2]],
                  processedData.visitors.thumbs || 0
                )}
                appliesPercent={getPercent(
                  processedData.applies.bars[latest4[2]],
                  processedData.visitors.thumbs || 0
                )}
                interviewsPercent={getPercent(
                  processedData.interviews.bars[latest4[2]],
                  processedData.visitors.thumbs || 0
                )}
                assessmentsPercent={getPercent(
                  processedData.assessments.bars[latest4[2]],
                  processedData.visitors.thumbs || 0
                )}
              />
              <BarChartsGroup
                visitsPercent={getPercent(
                  processedData.visitors.bars[latest4[3]],
                  processedData.visitors.thumbs || 0
                )}
                appliesPercent={getPercent(
                  processedData.applies.bars[latest4[3]],
                  processedData.visitors.thumbs || 0
                )}
                interviewsPercent={getPercent(
                  processedData.interviews.bars[latest4[3]],
                  processedData.visitors.thumbs || 0
                )}
                assessmentsPercent={getPercent(
                  processedData.assessments.bars[latest4[3]],
                  processedData.visitors.thumbs || 0
                )}
              />
            </div>
            <div className="keys">
              <p className="label">
                {latest4[0] + 5}:00 - {latest4[1] + 5}:00
              </p>
              <p className="label">
                {latest4[1] + 5}:00 - {latest4[2] + 5}:00
              </p>
              <p className="label">
                {latest4[2] + 5}:00 - {latest4[3] + 5}:00
              </p>
              <p className="label">
                {latest4[3] + 5}:00 - {latest4[3] + 6}:00
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BarCharts;
