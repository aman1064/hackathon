import React, { PureComponent } from "react";

import PercentBar from "../../../../../ui-components/PercentBar";

import "./BarCharts.scss";

const BarChartsGroup = () => (
  <div className="barsCntnr score">
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={100}
      color="#c6b9f1"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={50}
      color="#f8b5b5"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={30}
      color="#b7dcfd"
    />
    <PercentBar
      multiplier={2}
      direction="vertical"
      percent={20}
      color="#ffd768"
    />
  </div>
);

class BarCharts extends PureComponent {
  render() {
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
              <BarChartsGroup />
              <BarChartsGroup />
              <BarChartsGroup />
              <BarChartsGroup />
            </div>
            <div className="keys">
              <p className="label">8:00-11:00</p>
              <p className="label">11:00-14:00</p>
              <p className="label">14:00-17:00</p>
              <p className="label">17:00-20:00</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BarCharts;
