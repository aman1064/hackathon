import React from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import Loadable from "react-loadable";

import Loading from "../../../../atoms/Loading";
import routeConfig from "../../../../../constants/routeConfig";

import {
  openGlobalPrompt,
  updateUserProfile,
  handlepublicJDApply,
  deleteUserDetailsData,
  showWhatsappOptIn
} from "../../../../../sagas/ActionCreator";
import { handleFormValidState } from "../../../../organisms/Field/saga/ActionCreator";
import { setInteractionId } from "../../../OtpPage/saga/ActionCreator";
import get from "../../../../../utils/jsUtils/get";

import "./ContestApply.scss";

const InstaApplyView = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ContestApply-view" */ "./components/InstaApplyView"),
  loading: Loading
});

const InstaApplyContainer = props => {
  const { practiceSignup } = routeConfig;
  return (
    <Switch>
      <Route
        exact
        path={practiceSignup}
        render={routeprops => <InstaApplyView {...props} {...routeprops} />}
      />
    </Switch>
  );
};

const mapSTP = state => ({
  jobDetails: state.jobData.jobDetails,
  userDetails: state.commonData.userDetails,
  accessToken: state.commonData.userDetails.accessToken,
  userBasicDetails: state.commonData.userBasicDetails,
  contestApplyForm: get(state.forms, "contestApply")
});

const mapDTP = {
  openGlobalPrompt,
  updateUserProfile,
  setInteractionId,
  handlepublicJDApply,
  deleteUserDetailsData,
  showWhatsappOptIn,
  handleFormValidState
};

export default connect(
  mapSTP,
  mapDTP
)(InstaApplyContainer);
