import React from "react";

import Shimmer from "../../../../atoms/Shimmer";

const QuizInsightsShimmer = () => (
  <div>
    <AttemptStatsShimmer />
    <div className="ConceptStats">
      <h2>
        <Shimmer width={230} height={24} />
      </h2>
      <div className="chartsCntnr">
        <div className="chart">
          <div className="chartHeading">
            <Shimmer width={172} height={16} />
            <Shimmer width={64} height={16} />
          </div>
          <Shimmer className="ProgressBar" height={6} width={270} />
        </div>
        <div className="chart">
          <div className="chartHeading">
            <Shimmer width={172} height={16} />
            <Shimmer width={64} height={16} />
          </div>
          <Shimmer className="ProgressBar" height={6} width={270} />
        </div>
        <div className="chart">
          <div className="chartHeading">
            <Shimmer width={172} height={16} />
            <Shimmer width={64} height={16} />
          </div>
          <Shimmer className="ProgressBar" height={6} width={270} />
        </div>
        <div className="chart">
          <div className="chartHeading">
            <Shimmer width={172} height={16} />
            <Shimmer width={64} height={16} />
          </div>
          <Shimmer className="ProgressBar" height={6} width={270} />
        </div>
      </div>
      <div className="topicsCntnr">
        <div className="plus">
          <Shimmer width={88} height={16} marginBottom={14} />
          <div className="plusChips">
            <Shimmer width={60} height={24} marginRight={8} className="chip" />
            <Shimmer width={84} height={24} marginRight={8} className="chip" />
            <Shimmer width={146} height={24} marginRight={8} className="chip" />
            <Shimmer width={100} height={24} marginRight={8} className="chip" />
          </div>
        </div>
        <div className="minus">
          <Shimmer width={88} height={16} marginBottom={14} />
          <div className="minusChips">
            <Shimmer width={60} height={24} marginRight={8} className="chip" />
            <Shimmer width={100} height={24} marginRight={8} className="chip" />
            <Shimmer width={84} height={24} marginRight={8} className="chip" />
            <Shimmer width={146} height={24} marginRight={8} className="chip" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AttemptStatsShimmer = () => (
  <div className="attemptStats">
    <AttemptStatsShimmerItem />
    <AttemptStatsShimmerItem />
    <AttemptStatsShimmerItem />
    <AttemptStatsShimmerItem />
  </div>
);

const AttemptStatsShimmerItem = () => (
  <div className="attemptStatsCard">
    <Shimmer
      className="roundCorner"
      width={48}
      height={48}
      marginLeft="auto"
      marginRight="auto"
    />
    <Shimmer
      width={120}
      height={18}
      marginTop={10}
      marginLeft="auto"
      marginRight="auto"
    />
    <Shimmer
      width={70}
      height={28}
      marginTop={4}
      marginLeft="auto"
      marginRight="auto"
    />
  </div>
);

export const QuizInsightsHeaderShimmer = () => (
  <div className="headingCntnr">
    <div className="textContent">
      <div className="hideInM">
        <Shimmer width={200} height={24} marginTop={10} />
        <Shimmer width={700} height={40} marginTop={10} />
        <Shimmer width={660} height={20} marginTop={16} />
      </div>
      <div className="showInM">
        <Shimmer width={160} height={22} />
        <Shimmer width={280} height={28} marginTop={6} />
        <Shimmer width={304} height={18} marginTop={12} />
      </div>
    </div>
  </div>
);

export const PerformanceHistoryHeadingShimmer = () => (
  <div className="headingCntnr isPerformance">
    <div className="textContent">
      <div className="hideInM">
        <Shimmer width={250} height={30} />
        <div className="scrollCntnr">
          <div className="chipsCntnr">
            <Shimmer
              className="chip"
              width={160}
              height={32}
              marginTop={16}
              marginRight={8}
            />
            <Shimmer
              className="chip"
              width={130}
              height={32}
              marginTop={16}
              marginRight={8}
            />
            <Shimmer
              className="chip"
              width={140}
              height={32}
              marginTop={16}
              marginRight={8}
            />
          </div>
        </div>
      </div>
      <div className="showInM">
        <Shimmer width={250} height={26} />
        <div className="scrollCntnr">
          <div className="chipsCntnr">
            <Shimmer
              className="chip"
              width={160}
              height={32}
              marginTop={12}
              marginRight={8}
            />
            <Shimmer
              className="chip"
              width={130}
              height={32}
              marginTop={12}
              marginRight={8}
            />
            <Shimmer
              className="chip"
              width={140}
              height={32}
              marginTop={12}
              marginRight={8}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QuizInsightsShimmer;
