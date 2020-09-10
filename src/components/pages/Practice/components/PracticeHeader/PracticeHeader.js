import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import LogoHeader from "../../../../organisms/LogoHeader";
import SocialShare from "../../../../templates/ShareLink/SocialShare";
import Button from "../../../../../ui-components/Button";

import { ShareIcon, ShareBrightIcon } from "../../../../atoms/Icon";

import routeConfig from "../../../../../constants/routeConfig";

import { getRegistrationScreenData } from "../../../Registration/saga/ActionCreator";

import "./PracticeHeader.scss";

const PracticeHeader = ({
  view,
  shareUrl,
  userName,
  accessToken,
  shareTitle,
  history,
  profile,
  getRegistrationScreenData: _getRegistrationScreenData
}) => {
  const afterShare = () => {};
  const handleLoginClick = () => {
    history.push(`${routeConfig.login}${history.location.search}`, {
      route: "contestApply",
      from: history.location.pathname
    });
  };
  const handleUserNameClick = () => {
    if (accessToken && !profile.isUserProfileCompleted) {
      new Promise((resolve, reject) => {
        _getRegistrationScreenData(profile, resolve, reject);
      }).then(screenData => {
        history.push(
          routeConfig.regWithId.replace(":id", screenData.firstScreenId)
        );
      });
    } else {
      history.push("/");
    }
  };
  return (
    <div className="logoHeaderCntnr">
      <LogoHeader
        smgoLogo
        logoTone={view === "home" ? "white" : "dark"}
        redirectLink={routeConfig.practice}
      >
        <div className="headerRight">
          <div className="breakSmallNav">
            <div className="breakSmallNav_item">
              <Link to={routeConfig.practiceBrowseQuiz} className="link">
                Browse Tests
              </Link>
            </div>
            <span className="separator" />
            <div className="breakSmallNav_item">
              <Link
                to={routeConfig.practicePerformanceHistory}
                className="link"
              >
                Your Performance
              </Link>
            </div>
            <span className="separator" />
            <SocialShare
              shareUrl={shareUrl}
              shareTitle={shareTitle}
              className="headerShare"
              buttonProps={{
                children: (
                  <span>
                    <span className="hideInM">
                      {view === "home" ? (
                        <ShareBrightIcon size={14} />
                      ) : (
                        <ShareIcon size={14} />
                      )}
                      <span className="shareText">Share</span>
                    </span>
                    <span className="showInM">
                      {view === "home" ? (
                        <ShareBrightIcon size={12} />
                      ) : (
                        <ShareIcon size={12} />
                      )}
                      <span className="shareText">Share</span>
                    </span>
                  </span>
                ),
                className: "share"
              }}
              onClickCB={afterShare}
            />
          </div>

          {accessToken ? (
            <Button
              type="link"
              className="loginCTA"
              onClick={handleUserNameClick}
            >
              Hi {userName}
            </Button>
          ) : (
            <Button type="link" className="loginCTA" onClick={handleLoginClick}>
              Login
            </Button>
          )}
          <Link to="/" className="jobseekerCTA">
            Looking for job?
          </Link>
        </div>
      </LogoHeader>
    </div>
  );
};

PracticeHeader.propTypes = {
  view: PropTypes.string,
  history: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  shareUrl: PropTypes.string.isRequired,
  shareTitle: PropTypes.string,
  accessToken: PropTypes.string,
  userName: PropTypes.string,
  getRegistrationScreenData: PropTypes.func.isRequired
};

PracticeHeader.defaultProps = {
  view: "",
  accessToken: "",
  userName: "",
  shareTitle: ""
};

const mapSTP = ({ commonData }) => ({
  accessToken: commonData.userDetails.accessToken,
  userName: commonData.userDetails.name,
  profile: commonData.userDetails.profile
});

const mapDTP = { getRegistrationScreenData };

export default connect(mapSTP, mapDTP)(PracticeHeader);
