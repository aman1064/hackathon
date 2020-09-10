import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { NojobsIcon } from "../../../../atoms/Icon";
import Button from "../../../../atoms/Button";
import routeConfig from "../../../../../constants/routeConfig";

class NoSavedJobs extends PureComponent {
  render() {
    return (
      <div className="SavedJobs__contentWrapper">
        <div className="SavedJobs__content">
          <div className="SavedJobs__imageWrapper">
            <NojobsIcon height={172} width="220" />
          </div>
          <h2 className="textCenter">No bookmarked jobs</h2>
          <p className="SavedJobs__message">
            Use the bookmark icon on jobs and you may view them here
          </p>
          <div className="marginTop_36 textAlign_center">
            <Button
              className="browse__PrimaryBtn"
              onClick={() => {
                this.props.history.push(routeConfig.jobs);
              }}
            >
              Go to new jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
NoSavedJobs.propTypes = {
  history: PropTypes.object
};

NoSavedJobs.defaultProps = {
  history: {}
};

export default NoSavedJobs;
