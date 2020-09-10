import React from "react";
import PropTypes from "prop-types";

import SocialShare from "../../../../templates/ShareLink/SocialShare";

import { ShareBlueIcon } from "../../../../atoms/Icon/icons";
import hifi from "../../../../../assets/images/svg/hifi.svg";

import "./ShareWidget.scss";

const ShareWidget = ({ quizName, shareUrl, className, shareTitle }) => {
  const afterShare = () => {};
  return (
    <div className={`ShareWidget ${className}`}>
      {quizName ? (
        <p className="ShareWidgetHeading">
          Tell your friends about this {quizName} Test!
        </p>
      ) : (
        <p className="ShareWidgetHeading">
          Share these tests with your friends and challenge them!
        </p>
      )}

      <SocialShare
        shareUrl={shareUrl}
        shareTitle={shareTitle}
        buttonProps={{
          children: (
            <span>
              <ShareBlueIcon size={11} />
              <span>Share in your network</span>
            </span>
          ),
          className: "shareCTA"
        }}
        onClickCB={afterShare}
      />
      <img className="hifiImg" src={hifi} alt="hi-five" />
    </div>
  );
};

ShareWidget.propTypes = {
  quizName: PropTypes.string,
  shareUrl: PropTypes.string.isRequired,
  shareTitle: PropTypes.string.isRequired,
  className: PropTypes.string
};

ShareWidget.defaultProps = {
  quizName: "",
  className: ""
};

export default ShareWidget;
