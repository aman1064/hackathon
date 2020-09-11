import React from "react";
import { connect } from "react-redux";

import Company from "./Company";

import { resetContestQuest } from "../Practice/components/Contest/saga/actionCreator";

let CompanyContainer = props => <Company {...props} />;

const mapSTP = ({ commonData }) => ({
  userName: commonData.userDetails.name
});

const mapDTP = {
  resetContestQuest
};

export default connect(mapSTP, mapDTP)(CompanyContainer);
