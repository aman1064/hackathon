import React, { Component } from "react";

import StatusNavItem from "../../molecules/StatusNavItem";
import * as statusNavConfig from "../../../configs/statusNav.json";
import "./StatusNav.scss";

class StatusNav extends Component {
  statusNavData = statusNavConfig.default;
  render() {
    return (
      <div className="statusNav">
        {Object.keys(this.statusNavData).map(e => (
          <StatusNavItem
            key={e}
            config={this.statusNavData[e]}
            {...this.props}
          />
        ))}
      </div>
    );
  }
}

export default StatusNav;
