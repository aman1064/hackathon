import React from "react";
import "./howThisWorks.scss";

import takeQuiz from "../../../../../assets/images/svg/takeQuiz.svg";
import barChart from "../../../../../assets/images/svg/barChart.svg";
import certificate from "../../../../../assets/images/svg/certificate.svg";

const LIST = [
  {
    key: 1,
    title: "Take the Test",
    text: "The questions are in Multiple Choice format.",
    icon: takeQuiz
  },
  {
    key: 2,
    title: "Get Detailed Report",
    text: "Know your strong areas and topics you need to work on.",
    icon: barChart
  },
  {
    key: 3,
    title: "Earn a certificate",
    text: "For Scoring 65% Marks or more in a test",
    icon: certificate
  }
];

const HowThisWorks = () => {
  return (
    <div className="how-this-works">
      <h2 className="heading">How This Works?</h2>
      <div className="item-group">
        {LIST.map(data => (
          <div className="item-content" key={data.key}>
            <div className="icon">
              <img src={data.icon} alt="icon" />
            </div>
            <div className="text">
              <span className="title">{data.title}</span>
              <span>{data.text}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowThisWorks;
