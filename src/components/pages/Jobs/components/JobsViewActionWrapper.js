import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "../../../atoms/Button";

class JobsViewActionWrapper extends Component {
  handleRemoveJobClick = () => {
    this.props.handleRemoveJobClick(this.props.jobId);
  };

  handleKnowMoreClick = () => {
    this.props.handleKnowMoreClick(this.props.jobId);
  };

  render() {
    return (
      <div className="spreadHr jobCard__cta_wrapper">
        <Button appearance="secondary" onClick={this.handleRemoveJobClick}>
          Not relevant
        </Button>
        <Button onClick={this.handleKnowMoreClick}>Know more</Button>
      </div>
    );
  }
}
JobsViewActionWrapper.propTypes = {
  handleRemoveJobClick: PropTypes.func,
  handleKnowMoreClick: PropTypes.func,
  jobId: PropTypes.number
};
JobsViewActionWrapper.defaultProps = {
  handleKnowMoreClick: () => {},
  handleRemoveJobClick: () => {},
  jobId: 0
};
export default JobsViewActionWrapper;
