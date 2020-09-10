import React from "react";
import PropTypes from "prop-types";
import Button from "../../../atoms/Button";

const LastJobCard = props => (
  <div className={`${props.className}`}>
    <p className="marginTop_32 fontSize_13">
      Hey! You have viewed all the jobs which match the best with your profile
      and preferences.
    </p>
    <p className="marginTop_20 fontSize_13">
      You may browse the jobs viewed earlier and apply to them.
    </p>
    <div className="textCenter marginTop_50">
      <Button
        type="Link"
        className="browse__PrimaryBtn"
        onClick={props.handleViewedJobsClick}
      >
        Go to viewed jobs
      </Button>
    </div>
    <div className="textCenter marginTop_32 marginBottom_32">
      <Button
        type="link"
        className="LastJobCard__TextBtn"
        onClick={props.viewAgainClick}
      >
        View these jobs again
      </Button>
    </div>
  </div>
);
LastJobCard.propTypes = {
  viewAgainClick: PropTypes.func,
  handleViewedJobsClick: PropTypes.func,
  className: PropTypes.string
};

LastJobCard.defaultProps = {
  viewAgainClick: () => {},
  handleViewedJobsClick: () => {},
  className: ""
};

export default LastJobCard;
