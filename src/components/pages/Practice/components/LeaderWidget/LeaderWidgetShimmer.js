import React from "react";

import Shimmer from "../../../../atoms/Shimmer";

const LeaderWidgetShimmer = () => (
  <div>
    <div className="headCntnr">
      <div className="headLeft">
        <Shimmer width={242} height={21} />
        <Shimmer width={80} height={18} marginTop={6} />
      </div>
      <div className="imageCntnr">
        <Shimmer width={32} height={32} />
      </div>
    </div>
    <div className="leaderCntnr">
      <LeaderItemShimmer />
      <LeaderItemShimmer />
      <LeaderItemShimmer />
      <LeaderItemShimmer />
      <LeaderItemShimmer />
    </div>
  </div>
);

const LeaderItemShimmer = () => (
  <div className="leaderItem">
    <span className="rank">
      <Shimmer width={18} height={18} marginLeft="auto" marginRight="auto" />
    </span>
    <Shimmer className="roundCorner" width={32} height={32} />
    <Shimmer width={100} height={18} marginLeft={12} />
    <Shimmer width={26} height={18} marginLeft="auto" />
  </div>
);

export default LeaderWidgetShimmer;
