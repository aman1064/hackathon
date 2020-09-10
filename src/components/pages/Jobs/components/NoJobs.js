import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { NojobsIcon } from "../../../atoms/Icon";
import Button from "../../../atoms/Button";
import routeConfig from "../../../../constants/routeConfig";
import { trackCleverTap } from "../../../../utils/tracking";
import tracker from "../../../../analytics/tracker";

class NoJobs extends PureComponent {
  handleGoToViewedJobsClick = () => {
    tracker().on("event", {
      hitName: "browse$go_to_viewed_jobs_clicked$card"
    });
    trackCleverTap("GoToViewedJobs_Browse");
    this.props.history.push(routeConfig.viewedJobs);
  };

  render() {
    trackCleverTap("PV_NoJobs");
    return (
      <div className="NewJobs__contentWrapper">
        <div className="NewJobs__content">
          <div className="NewJobs__imageWrapper">
            <NojobsIcon size={200} />
          </div>
          <h2 className="textCenter">Seems like you’ve exhausted new jobs!</h2>
          <p className="NewJobs__message">
            {
              "Stay tuned with BigShyft while our folks get this space filled or go to viewed jobs "
            }
          </p>
          <div className="marginTop_36 textAlign_center">
            <Button
              className="browse__PrimaryBtn"
              onClick={this.handleGoToViewedJobsClick}
              appearance="primary"
              type="button"
            >
              Go to viewed jobs
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
NoJobs.propTypes = {
  history: PropTypes.object
};

NoJobs.defaultProps = {
  history: {}
};

export default NoJobs;
