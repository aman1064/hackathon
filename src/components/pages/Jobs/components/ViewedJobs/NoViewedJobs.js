import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import routeConfig from "../../../../../constants/routeConfig";
import { NojobsIcon } from "../../../../atoms/Icon";
import Button from "../../../../atoms/Button";

import { trackCleverTap } from "../../../../../utils/tracking";
import tracker from "../../../../../analytics/tracker";

class NoViewedJobs extends PureComponent {
  handleGoToNewJobsClick = () => {
    trackCleverTap("GoToNewJobs_ViewedJobs");
    tracker().on("event", {
      hitName: `browse$go_to_new_jobs_clicked$viewed_jobs`
    });
    this.props.history.push(routeConfig.jobs);
  };

  render() {
    return (
      <div className="ViewedJobs__contentWrapper">
        <div className="ViewedJobs__content">
          <div className="ViewedJobs__imageWrapper">
            <NojobsIcon height={172} width={220} />
          </div>
          <h2 className="textCenter">No jobs viewed yet!</h2>
          <p className="ViewedJobs__message ViewedJobs__paddingMessage">
            Jobs that you view in new jobs section will appear here
          </p>
          <div className="marginTop_36 textAlign_center">
            <Button
              className="browse__PrimaryBtn"
              component={Link}
              onClick={this.handleGoToNewJobsClick}
            >
              Go to new jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
NoViewedJobs.propTypes = {
  history: PropTypes.object
};

NoViewedJobs.defaultProps = {
  history: {}
};

export default NoViewedJobs;
