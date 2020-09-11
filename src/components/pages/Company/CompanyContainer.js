import React from "react";
import { connect } from "react-redux";

import Company from "./Company";
import { resetContestQuest } from "../Practice/components/Contest/saga/actionCreator";
import {getNotifications} from "../../../sagas/ActionCreator";

let CompanyContainer = props => <Company {...props} />;

const mapSTP = ({ commonData }) => ({
  userName: commonData.userDetails.name,
  userId: commonData.userBasicDetails && commonData.userBasicDetails.id,
  newNotifications: commonData.newNotifications,
});

const mapDTP = {
  resetContestQuest,
  getNotifications
};

export default connect(mapSTP, mapDTP)(CompanyContainer);
