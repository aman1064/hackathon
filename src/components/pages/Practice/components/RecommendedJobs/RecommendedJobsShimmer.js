import React from "react";

import Shimmer from "../../../../atoms/Shimmer";

const RecommendedJobsShimmer = () => (
  <>
    <RecommendedJobsCardShimmer />
    <RecommendedJobsCardShimmer />
    <RecommendedJobsCardShimmer />
    <RecommendedJobsCardShimmer />
  </>
);

const RecommendedJobsCardShimmer = () => (
  <div className="RecJobsCard">
    <div className="logoCntnr">
      <Shimmer className="roundCorner" width={40} height={40} />
    </div>
    <Shimmer width={240} height={21} />
    <Shimmer width={78} height={16} marginTop={4} />
    <Shimmer width={118} height={16} marginTop={10} />
    <div className="details">
      <div className="exp">
        <Shimmer width={45} height={16} marginTop={6} />
        <Shimmer width={63} height={16} marginTop={6} marginLeft={8} />
      </div>
      <div className="salary">
        <Shimmer width={45} height={16} marginTop={6} marginLeft={22} />
        <Shimmer width={35} height={16} marginTop={6} marginLeft={8} />
      </div>
    </div>
  </div>
);

export default RecommendedJobsShimmer;
