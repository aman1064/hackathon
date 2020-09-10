import React from "react";

import Shimmer from "../../../../atoms/Shimmer";

const QuizStepsShimmer = () => (
  <ul className="quizStepsList isShimmer">
    <li className="quizStepsItem">
      <Shimmer width={32} height={32} className="stepBullet" />
      <Shimmer width={200} height={24} marginTop={6} />
      <div className="stats">
        <Shimmer width={130} height={16} marginTop={6} marginRight={8} />
        <Shimmer width={120} height={16} marginTop={6} />
      </div>
    </li>
    <li className="quizStepsItem isActive">
      <Shimmer width={32} height={32} className="stepBullet" />
      <div className="headingCntnr">
        <Shimmer width={230} height={24} marginRight={8} />
        <div className="stats">
          <Shimmer width={240} height={17} marginTop={5} />
        </div>
      </div>

      <div className="topics">
        <Shimmer width={110} height={18} marginTop={8} marginRight={8} />
        <Shimmer width={130} height={18} marginTop={8} />
      </div>
      <Shimmer className="btn" width={134} height={36} marginTop={16} />
    </li>
    <li className="quizStepsItem isLocked">
      <Shimmer width={32} height={32} className="stepBullet" />
      <Shimmer width={190} height={24} />
      <div className="stats">
        <Shimmer width={230} height={16} marginTop={6} />
      </div>
    </li>
  </ul>
);

export default QuizStepsShimmer;
