import React, { PureComponent } from "react";

const BarChartsGroup = () => (
  <div className="barsCntnr score">
    <PercentBar percent={selfScorePC} color="#ddeffe" />
    <PercentBar percent={topperScorePC} color="#abd6fc" />
    <PercentBar percent={topperScorePC} color="#abd6fc" />
    <PercentBar percent={topperScorePC} color="#abd6fc" />
  </div>
);

class BarCharts extends PureComponent {
  render() {
    return (
      <div className="BarCharts">
        <div>
          <div className="legendsCntnr">
            <h2>Comparison from last attempt</h2>
            <div className="legend">
              <span className="self">Last attempt</span>
              <span className="from">Current attempt</span>
            </div>
          </div>

          <div className="chartCntnr">
            <div className="keys">
              <p className="label">Score (%)</p>
              <p className="label">Time taken (%) )}</p>
              <p className="label">Accuracy (%)</p>
            </div>
            <div className="diagram">
              <BarChartsGroup />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BarCharts;
