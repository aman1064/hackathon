import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import QuizList from "./QuizList";
import PracticeHeader from "./PracticeHeader";
import Footer from "../../../organisms/AppFooter";
import Testimonials from "./Testimonials";
import HowThisWorks from "./HowThisWorks";

import * as practiceActions from "../redux/PracticeActionsCreators";

import tracker from "../../../../analytics/tracker";

import Playforacause from "../../../../assets/images/svg/Playforacause.svg";
import { GreentickIcon } from "../../../atoms/Icon/icons";

class PracticeHome extends PureComponent {
  componentDidMount() {
    tracker().on("ctapPageView", {
      hitName: "pv_contest_practice_home",
      payload: {
        page_name: "js_contest_practice_home",
        ct: true
      }
    });
  }

  afterShare = () => {};

  render() {
    const { getQuizList, quizList, history } = this.props;
    return (
      <div className="Practice PracticeHome">
        <PracticeHeader
          view="home"
          shareTitle="Get detailed insights on your skills by attempting real life questions on Bigshyft."
          shareUrl="https://bsyft.ai/F9rbh9"
          history={history}
        />
        <div className="practiceHome">
          <div className="banner">
            <div className="bannerCntnr">
              <div className="textCntnr">
                <h1 className="bannerHeading">Get insights on your Skills</h1>
                <h2 className="bannerSubheading">
                  Try BigShyft’s free skill-assessment-tool and get detailed
                  report
                </h2>
                <ul className="benefits">
                  <li>
                    <GreentickIcon size={18} />
                    Real-life questions
                  </li>
                  <li>
                    <GreentickIcon size={18} />
                    Get a certificate on passing
                  </li>
                  <li>
                    <GreentickIcon size={18} />
                    Get a detailed analysis of your strong &amp; weak areas
                  </li>
                </ul>
              </div>
              <div className="imgCntnr">
                <img src={Playforacause} alt="earn medal" />
              </div>
            </div>
          </div>
          <QuizList
            heading="Take the Popular tests!"
            description="Candidates showing interest in these tests"
            quizData={quizList}
            getQuizList={getQuizList}
            threshold={4}
          />
          <HowThisWorks />
          <Testimonials />
          <Footer variation="classy" />
        </div>
      </div>
    );
  }
}

PracticeHome.propTypes = {
  getQuizList: PropTypes.func.isRequired,
  quizList: PropTypes.object,
  history: PropTypes.object.isRequired
};

PracticeHome.defaultProps = {
  quizList: {
    data: null,
    isError: false,
    isLoading: false
  }
};

const mapSTP = ({ commonData, practice }) => ({
  accessToken: commonData.userDetails.accessToken,
  quizList: practice.quizList,
  userName: commonData.userDetails.name,
  profile: commonData.userDetails.profile
});

const mapDTP = { ...practiceActions };

export default connect(
  mapSTP,
  mapDTP
)(PracticeHome);
