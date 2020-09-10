import React, { Component } from "react";
import PropTypes from "prop-types";

import LogoHeader from "../../../../../organisms/LogoHeader";
import BackButton from "../../../../../molecules/BackButton";
import ContestApplyForm from "./contestApplyForm";
import Button from "../../../../../atoms/Button";
import routeConfig from "../../../../../../constants/routeConfig";
import tracker from "../../../../../../analytics/tracker";

class InstaApplyView extends Component {
  UNSAFE_componentWillMount() {
    const { handleFormValidState } = this.props;
    handleFormValidState({ form: "contestApply", isValid: true, errorMsg: "" });
  }

  componentDidMount() {
    const { accessToken, history, location } = this.props;
    if (!(location.state && location.state.from)) {
      history.push(
        `${routeConfig.signup}${this.props.history.location.search}`
      );
    }
    if (accessToken) {
      history.goForward();
    } else {
      window.__bgperformance.pageMeasure();
      tracker().on("ctapPageView", {
        hitName: "pv_signup_contest",
        payload: {
          page_name: "js_signup_contest",
          ct: true
        }
      });
    }
  }

  handleLoginOnClick = () => {
    const { location, history } = this.props;
    history.push(`${routeConfig.login}${history.location.search}`, {
      route: "contestApply",
      from: location.state.from
    });
  };

  render() {
    const { history } = this.props;
    return (
      <div className="InstaApply">
        <LogoHeader className="padding_0" redirectLink={routeConfig.practice}>
          <Button type="link" onClick={this.handleLoginOnClick}>
            Login
          </Button>
        </LogoHeader>
        <BackButton
          customClass="marginBottom_24"
          action={() => {
            return history.goBack();
          }}
        />
        <ContestApplyForm {...this.props} />
      </div>
    );
  }
}

InstaApplyView.propTypes = {
  accessToken: PropTypes.string,
  handleFormValidState: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  contestApplyForm: PropTypes.object.isRequired
};

InstaApplyView.defaultProps = {
  accessToken: ""
};

export default InstaApplyView;
