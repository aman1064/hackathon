import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../../../../atoms/Button";
import { BackButtonIcon } from "../../../../atoms/Icon/icons";

import routeConfig from "../../../../../constants/routeConfig";
import tracker from "../../../../../analytics/tracker";

import "./Instructions.scss";

class Instructions extends Component {
  componentDidMount() {
    const { contestId } = this.props;
  }

  componentDidUpdate() {
    if (this.props.disabled) {
      this.props.openGlobalPrompt(
        "You have already attempted this Test",
        "error"
      );
      this.props.history.goBack();
    }
  }

  goToLanding = () => {
    const {
      history,
      selectedContest: { groupId }
    } = this.props;
    history.goBack();
  };

  _handleStart = () => {
    const { contestId, selectedContest, handleSubmit } = this.props;
    handleSubmit();
  };

  render() {
    return (
      <div className="inst">
        <div className="instHeader">
          <button type="button" className="back" onClick={this.goToLanding}>
            <BackButtonIcon />
          </button>
          <h1 className="title">{this.props.selectedContest.title}</h1>
        </div>
        <div className="instWrapper">
          <p className="helpText">
            Instructions you should consider going through
          </p>
          <div
            className="instList"
            dangerouslySetInnerHTML={{
              __html: this.props.selectedContest.description
            }}
          />
          <div className="instCTAWrapper">
            <div className="bol">
              <p>
                This test is worth {this.props.selectedContest.totalScore}{" "}
                points
              </p>
            </div>
            <Button onClick={this._handleStart} disabled={this.props.disabled}>
              Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Instructions.propTypes = {
  contestId: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  openGlobalPrompt: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedContest: PropTypes.object.isRequired
};

Instructions.defaultProps = {
  disabled: false
};

export default Instructions;
