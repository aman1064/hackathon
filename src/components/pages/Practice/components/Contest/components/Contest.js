import React, { PureComponent } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import CountUp from "react-countup";
import Button from "../../../../../atoms/Button";
import RenderQuestion from "./RenderQuestion";
import routeConfig from "../../../../../../constants/routeConfig";
import { CONTEST_FORM_NAME } from "../constants";
import "../index.scss";
import Timer from "./Timer";
// import gemsImg from "../../../../../assets/images/png/gems.png";
import ExitModal from "./ExitModal";

class Contest extends PureComponent {
  constructor() {
    super();
    this.state = {
      currentScore: 0,
      prevScore: 0,
      isConfirmModalOpen: false
    };
  }

  componentDidMount() {
    const {
      location,
      contestId,
      isContestStart,
      resetSubmitting,
      submitting
    } = this.props;
    if (!isContestStart) {
      this.props.startContest(contestId, location.state.jobDetails.jobId);
    }
    this._currentScore = this.state.currentScore;
    if (submitting) {
      resetSubmitting();
    }
  }

  submitForm = isForceExit => {
    const {
      values,
      question,
      contestAttemptId,
      reset,
      profileId,
      contestId
    } = this.props;
    const payload = {
      contestAttemptId,
      questionId: question.id,
      selectedOptionId: values.answer
    };
    if (isForceExit) {
      payload.endQuiz = isForceExit;
    }
    reset(CONTEST_FORM_NAME);
    const promise = new Promise(resolve => {
      this.props.submitQuest(contestId, profileId, payload, resolve);
    });
    promise.then(res => {
      const newState = {
        prevScore: this.state.currentScore,
        currentScore: res.totalScore
      };
      if (res.totalScore !== this._currentScore) {
        this._currentScore = res.totalScore;
      }
      this.setState(newState);
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (!this.props.submitting) {
      this.submitForm();
    }
  };

  handleExitHandler = e => {
    e.preventDefault();
    this.setState({ isConfirmModalOpen: true });
  };

  confirmEnd = () => {
    if (!this.props.submitting) {
      this.submitForm(true);
    }
    // this.props.history.push(routeConfig.covidThankYou);
  };

  handleTimeOut = () => {
    if (!this.props.submitting) {
      this.submitForm(true);
    }
    // this.props.history.replace(routeConfig.covidThankYou);
  };

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  render() {
    const {
      question,
      isQuizComplete,
      totalQuestionsInQuiz,
      currentIndex,
      selectedContest,
      submitting,
      totalScore,
      contestAttemptId
    } = this.props;

    const { currentScore, prevScore, isConfirmModalOpen } = this.state;

    return (
      <div>
        <div className="contestHeader">
          <h1 className="title">{selectedContest.title}</h1>
          <Timer handleTimeOut={this.handleTimeOut} />
        </div>

        <form onSubmit={this.handleSubmit} className="contest-form">
          {isQuizComplete && (
            <Redirect
              to={routeConfig.practiceInsights.replace(":id", contestAttemptId)}
            />
          )}
          {question ? (
            <>
              <div className="helpTextCntnr">
                <p className="helpText">
                  Question {currentIndex} of {totalQuestionsInQuiz}
                </p>
                <div className="scoreCntnr">
                  <p>
                    Scored{" "}
                    <CountUp
                      start={prevScore}
                      end={currentScore || totalScore}
                    />{" "}
                    out of {selectedContest.totalScore} points.
                  </p>
                </div>
              </div>

              <h1
                className="question"
                dangerouslySetInnerHTML={{
                  __html: question.questionText
                }}
              />
              <RenderQuestion {...question} form={CONTEST_FORM_NAME} />
            </>
          ) : null}

          <div className="submitCTAWrapper">
            <Button
              buttonType="submit"
              disabled={false}
              className={submitting ? "loadingButton" : ""}
            >
              Next
            </Button>

            <Button
              className="endCTA"
              type="link "
              onClick={this.handleExitHandler}
            >
              End Test
            </Button>
            <ExitModal
              isConfirmModalOpen={isConfirmModalOpen}
              closeConfirmModal={this.closeConfirmModal}
              confirmEnd={this.confirmEnd}
              questionsAttempted={currentIndex - 1}
              totalQuestionsInQuiz={totalQuestionsInQuiz}
            />
          </div>
        </form>
      </div>
    );
  }
}

Contest.propTypes = {
  profileId: PropTypes.string,
  contestId: PropTypes.string.isRequired,
  isContestStart: PropTypes.bool,
  resetSubmitting: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  startContest: PropTypes.func.isRequired,
  values: PropTypes.object,
  question: PropTypes.object,
  contestAttemptId: PropTypes.string,
  reset: PropTypes.func.isRequired,
  submitQuest: PropTypes.func.isRequired,
  isQuizComplete: PropTypes.bool,
  totalQuestionsInQuiz: PropTypes.number,
  currentIndex: PropTypes.number,
  selectedContest: PropTypes.object,
  totalScore: PropTypes.number
};

Contest.defaultProps = {
  profileId: null,
  isContestStart: false,
  submitting: false,
  values: {},
  question: {},
  contestAttemptId: "",
  isQuizComplete: false,
  totalQuestionsInQuiz: 0,
  currentIndex: 0,
  selectedContest: null,
  totalScore: 0
};

export default Contest;
