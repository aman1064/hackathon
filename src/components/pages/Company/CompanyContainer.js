import React from "react";
import { connect } from "react-redux";

import Company from "./Company";

let CompanyContainer = props => <Company {...props} />;

const mapSTP = ({ commonData }) => ({
  userName: commonData.userDetails.name
});

export default connect(mapSTP)(CompanyContainer);
