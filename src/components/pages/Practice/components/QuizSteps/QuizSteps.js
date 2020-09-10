import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "../../../../../ui-components/Button";
import QuizStepsShimmer from "./QuizStepsShimmer";

import routeConfig from "../../../../../constants/routeConfig";
import { getDHMS } from "../../../../../utils/timeUtils";

import {
  LockIcon,
  InfoIcon,
  CoolDownCrossIcon
} from "../../../../atoms/Icon/icons";

import "./QuizSteps.scss";

class QuizSteps extends PureComponent {
  onRedirectToQuiz = contestId => () => {
    const { history, resetContestQuest } = this.props;
    resetContestQuest();
    localStorage.removeItem("isBackNotAllowed");
    history.push(routeConfig.practiceContest.replace(":contestId", contestId));
  };

  getQuizStatus = (currentQuiz, index, allQuiz) => {
    let status;
    if (currentQuiz.passed) {
      status = "isComplete";
    } else if (!currentQuiz.passed && index && !allQuiz[index - 1].passed) {
      status = "isLocked";
    } else if (!currentQuiz.passed && !currentQuiz.attemptId) {
      status = "isActive";
    } else if (!currentQuiz.passed && currentQuiz.attemptId) {
      status = "isCooldown";
    }

    return status;
  };

  getQuizStepByStatus = (quiz, index, allQuiz, quizStatus) => {
    let quizStep;
    let daysToRetake;
    if (quiz.attemptId) {
      const { days } = getDHMS(new Date() - new Date(quiz.startTime).getTime());
      daysToRetake = 30 - days > 0 ? 30 - days : 0;
    }

    switch (quizStatus) {
      case "isComplete":
        quizStep = (
          <li
            key={quiz.id}
            className={`quizStepsItem level${index + 1} ${quizStatus}`}
          >
            <span className="stepBullet">{index + 1}</span>
            <h2>{quiz.title} Test</h2>
            <div className="stats">
              <p>
                Your Score:{" "}
                <span className="score">{quiz.userScore} Points</span>
              </p>
              <Link
                className="resultCTA"
                to={routeConfig.practiceInsights.replace(":id", quiz.attemptId)}
              >
                View Detailed Results
              </Link>
            </div>
          </li>
        );
        break;

      case "isLocked":
        quizStep = (
          <li
            key={quiz.id}
            className={`quizStepsItem level${index + 1} ${quizStatus}`}
          >
            <span className="stepBullet">
              <LockIcon size={12} />
            </span>
            <h2>{quiz.title} Test</h2>
            <div className="stats">
              Score {parseInt(allQuiz[index - 1].totalScore * 0.65, 10)}+ in{" "}
              {allQuiz[index - 1].title} to unlock this test
            </div>
          </li>
        );
        break;

      case "isCooldown":
        quizStep = (
          <li
            key={quiz.id}
            className={`quizStepsItem level${index + 1} ${quizStatus}`}
          >
            <span className="stepBullet">
              <CoolDownCrossIcon size={32} />
            </span>
            <h2>{quiz.title} Test</h2>
            <div className="stats">
              <p>
                Your Score:{" "}
                <span className="score">{quiz.userScore} Points</span>
              </p>
              <Link
                className="resultCTA"
                to={routeConfig.practiceInsights.replace(":id", quiz.attemptId)}
              >
                View Detailed Results
              </Link>
            </div>
            <div className="cooldownMsg">
              {daysToRetake > 0 && (
                <div className="cooldownCntnr">
                  <p className="cooldownTime">
                    <InfoIcon />
                    You can retake this test in {daysToRetake} days
                  </p>
                  <Button disabled>Retake this test</Button>
                </div>
              )}
              {daysToRetake === 0 && (
                <Button onClick={this.onRedirectToQuiz(quiz.id)}>
                  Retake this test
                </Button>
              )}
            </div>
          </li>
        );
        break;

      case "isActive":
      default:
        quizStep = (
          <li
            key={quiz.id}
            className={`quizStepsItem level${index + 1} ${quizStatus}`}
          >
            <span className="stepBullet">{index + 1}</span>
            <div className="headingCntnr">
              <h2>{quiz.title} Test</h2>
              <div className="stats">
                {quiz.totalQuestions} Questions | {quiz.duration / 60000}{" "}
                Minutes | {quiz.totalScore} Points
              </div>
            </div>

            <div className="topics">
              <h3>Topics covered:</h3>
              <p className="topicsName">{quiz.contestSkills.join(", ")}</p>
              <Button onClick={this.onRedirectToQuiz(quiz.id)}>
                Take This Test
              </Button>
            </div>
          </li>
        );
        break;
    }
    return quizStep;
  };

  render() {
    const { quizDetails } = this.props;
    return (
      <div className="quizSteps">
        {quizDetails.isError && (
          <div>Some error occured... Please refresh the page</div>
        )}
        {quizDetails.isLoading && <QuizStepsShimmer />}
        {quizDetails.data && (
          <ul className="quizStepsList">
            {quizDetails.data.map((quiz, i, allQuiz) => {
              const quizStatus = this.getQuizStatus(quiz, i, allQuiz);
              return this.getQuizStepByStatus(quiz, i, allQuiz, quizStatus);
            })}
          </ul>
        )}
      </div>
    );
  }
}

QuizSteps.propTypes = {
  quizDetails: PropTypes.object,
  history: PropTypes.object.isRequired,
  resetContestQuest: PropTypes.func.isRequired
};

QuizSteps.defaultProps = {
  quizDetails: { data: null, isError: false, isLoading: false }
};

export default QuizSteps;
