import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import ContestInstructions from "../../Instructions";
import Contest from "./Contest";
import routeConfig from "../../../../../../constants/routeConfig";
import { getMins } from "../../../../../../utils/timeUtils";
import { isEmpty } from "../../../../../../utils/jsUtils";

class RenderContestScreen extends Component {
  static getDerivedStateFromProps(props) {
    const { selectedContest, getContests } = props;
    if (isEmpty(selectedContest)) {
      getContests();
    } else {
      document.title = selectedContest.title;
    }
  }

  componentWillUnmount() {
    const isBackNotAllowed = localStorage.getItem("isBackNotAllowed");

    if (isBackNotAllowed) {
      this.props.history.goForward();
    } else {
      this.props.beginQuizHandle(false);
    }
  }

  handleInstSubmit = () => {
    const { attemptedContests, contestId, selectedContest } = this.props;
    if (!attemptedContests.includes(contestId)) {
      this.props.beginQuizHandle(true);
      localStorage.setItem("isBackNotAllowed", true);
      const time = getMins(selectedContest.duration / 1000);
      localStorage.setItem("contestTimer", `${time}:00`);
    }
  };

  handleBlockedRoute = () => {
    const { isQuizComplete, isQuizBegin } = this.props;
    return isQuizBegin && !isQuizComplete;
  };

  render() {
    const { isQuizBegin, accessToken, selectedContest, location, history } = this.props;
    if (!location.state || !location.state.jobDetails || !location.state.jobDetails.jobId) {
      history.goBack();
      return  null;
    }

    const RenderComponent = isQuizBegin ? (
      <Contest {...this.props} />
    ) : (
      <ContestInstructions
        {...this.props}
        handleSubmit={this.handleInstSubmit}
      />
    );
    return (
      <>
        {!accessToken && Object.keys(selectedContest).length && (
          <Redirect
            to={{
              pathname: routeConfig.practiceSignup,
              state: {
                from: routeConfig.practiceDetails.replace(
                  ":id",
                  selectedContest.groupId
                )
              }
            }}
          />
        )}
        {accessToken && RenderComponent}
      </>
    );
  }
}

RenderContestScreen.propTypes = {
  selectedContest: PropTypes.object.isRequired,
  getContests: PropTypes.func.isRequired,
  getAttemptedTests: PropTypes.func.isRequired,
  attemptedContests: PropTypes.array,
  profileId: PropTypes.string,
  history: PropTypes.object.isRequired,
  beginQuizHandle: PropTypes.func.isRequired,
  contestId: PropTypes.string.isRequired,
  isQuizBegin: PropTypes.bool,
  isQuizComplete: PropTypes.bool,
  accessToken: PropTypes.string,
  location: PropTypes.object.isRequired
};

RenderContestScreen.defaultProps = {
  profileId: "",
  attemptedContests: [],
  isQuizBegin: false,
  isQuizComplete: false,
  accessToken: ""
};

export default RenderContestScreen;
