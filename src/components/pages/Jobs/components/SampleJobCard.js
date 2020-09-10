import React from "react";

import noJobs from "../../../atoms/Icon/iconsList/Nojobs.svg";

const SampleJobCard = () => (
  <div className="sampleJC SwipeCards__item active">
    <div className="sampleJC_imgWrapper">
      <img height="112" src={noJobs} alt="finding jobs" />
    </div>
    <h2 className="textCenter">These will be your future job cards</h2>
    <p className="sampleJC_message">
      Stay tuned with BigShyft while our folks get this space filled with jobs
      matching your profile.
    </p>
  </div>
);

export default SampleJobCard;
