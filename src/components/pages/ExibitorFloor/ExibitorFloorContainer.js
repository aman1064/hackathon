import React from "react";
import { connect } from "react-redux";

import ExibitorFloor from "./ExibitorFloor";

let ExibitorFloorContainer = props => <ExibitorFloor {...props} />;

const mapSTP = ({ commonData }) => ({
  userName: commonData.userDetails.name,
  newNotifications: commonData.newNotifications,
});

export default connect(mapSTP)(ExibitorFloorContainer);
