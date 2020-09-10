import React, { PureComponent } from "react";
import { ContestCard } from "./ContestCard";
import "./index.scss";
import routeConfig from "../../../../constants/routeConfig";
import doselectLogo from "../../../../assets/images/png/doselect_logo.png";

class ContestList extends PureComponent {
  state = {
    expandedCardIndex: -1
  };

  componentDidMount() {
    const { profileId, getContests, getAttemptedTests } = this.props;
    profileId && getAttemptedTests(profileId);
    getContests();
  }

  toggleExpandState = index => this.setState({ expandedCardIndex: index });

  handleStartQuiz = contestId => {
    const { attemptedContests, history, beginQuizHandle } = this.props;

    if (!attemptedContests.includes(contestId)) {
      localStorage.removeItem("isBackNotAllowed");
      beginQuizHandle(false);
      const url = routeConfig.covidContest.replace(":contestId", contestId);
      history.push(url);
    }
  };

  render() {
    const { contestList, attemptedContests = [], quizEnded } = this.props;
    const { expandedCardIndex } = this.state;
    return (
      <div className="contest-list-container">
        {contestList.map((contest, index) => {
          return (
            <ContestCard
              key={contest.title}
              {...contest}
              disabled={attemptedContests.includes(contest.id)}
              expanded={index === expandedCardIndex}
              actions={{
                toggleExpandState: () => this.toggleExpandState(index),
                handleStartQuiz: () => this.handleStartQuiz(contest.id)
              }}
              quizEnded={quizEnded}
            />
          );
        })}
        <p className="cobrand">
          <span>Contest partner </span>
          <div className="imgCntnr">
            <img src={doselectLogo} alt="doselect" />
          </div>
        </p>
      </div>
    );
  }
}

export default ContestList;
