import React from "react";

import Shimmer from "../../../../atoms/Shimmer";

const QuizListShimmer = () => new Array(4).fill(<QuizCardShimmer />);

const QuizCardShimmer = () => (
  <div className="QuizCardShimmer quizCardCntnr">
    <div className="quizCard">
      <div className="mobLeft">
        <div className="hideInM">
          <Shimmer height={40} width={40} />
        </div>
        <div className="showInM">
          <Shimmer height={60} width={60} />
        </div>
      </div>
      <div className="mobRight">
        <div className="hideInM">
          <Shimmer height={23} width={80} marginTop={16} />
        </div>
        <div className="showInM">
          <Shimmer height={23} width={80} />
        </div>

        <Shimmer height={18} width={140} marginTop={8} />
        <Shimmer height={18} width={140} marginTop={14} />
      </div>
    </div>
  </div>
);

export default QuizListShimmer;
