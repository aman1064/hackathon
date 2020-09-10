import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "../../../../../ui-components/Button";
import QuizListShimmer from "./QuizListShimmer";

import blueArrow from "../../../../../assets/images/svg/blue_Arrow.svg";

import "./QuizList.scss";

class QuizList extends PureComponent {
  constructor() {
    super();
    this.state = {
      isExpanded: false
    };
  }

  componentDidMount() {
    const { getQuizList } = this.props;
    getQuizList();
  }

  expandQuizList = () => {
    this.setState({ isExpanded: true });
  };

  renderAdjustment = tileslength => {
    const extraTiles = 3 - (tileslength % 3);
    return new Array(extraTiles).fill(<div className="quizCardCntnr" />);
  };

  render() {
    const {
      quizData,
      heading,
      description,
      className = "",
      groupIdToRemove = "",
      threshold
    } = this.props;
    const { isExpanded } = this.state;
    const quizListToShow =
      quizData.data && !isExpanded
        ? quizData.data.slice(0, threshold)
        : quizData.data;
    return (
      <div className={`quizList ${className}`}>
        <h2 className="quizHeading">{heading}</h2>
        <p className="quizDesc">{description}</p>
        <div className="quizCntnr">
          {quizData.isLoading && <QuizListShimmer />}
          {quizData.data &&
            quizListToShow &&
            quizListToShow.map(quiz => {
              let quizItem = null;
              if (quiz.groupId !== groupIdToRemove) {
                quizItem = (
                  <div className="quizCardCntnr" key={quiz.groupId}>
                    <div className="quizCard">
                      <div className="mobLeft">
                        <img
                          className="logo"
                          src={quiz.groupLogo}
                          alt="quiz logo"
                        />
                      </div>
                      <div className="mobRight">
                        <h3>{quiz.group}</h3>
                        <p className="stats">
                          {quiz.totalParticipants &&
                            quiz.totalParticipants.toLocaleString()}{" "}
                          Participants
                        </p>
                        <Link
                          className="CTA"
                          to={`/practice/group/${quiz.groupId}`}
                        >
                          Browse Test{" "}
                          <img
                            className="arrow"
                            src={blueArrow}
                            alt="blue arrow"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              return quizItem;
            })}
          {quizData.data &&
            quizListToShow &&
            this.renderAdjustment(
              groupIdToRemove
                ? quizListToShow.length - 1
                : quizListToShow.length
            )}
        </div>
        {!isExpanded && quizData.data && quizData.data.length > threshold && (
          <div className="btnCntnr">
            <Button appearance="secondary" onClick={this.expandQuizList}>
              Show All Tests
            </Button>
          </div>
        )}
      </div>
    );
  }
}

QuizList.propTypes = {
  getQuizList: PropTypes.func.isRequired,
  quizData: PropTypes.object,
  heading: PropTypes.string,
  description: PropTypes.string,
  className: PropTypes.string,
  groupIdToRemove: PropTypes.string,
  threshold: PropTypes.number
};

QuizList.defaultProps = {
  quizData: {
    data: null,
    isError: false,
    isLoading: false
  },
  heading: "Take the Popular tests!",
  description: "Candidates showing interest in these tests",
  className: "",
  groupIdToRemove: "",
  threshold: 1000
};

export default QuizList;
