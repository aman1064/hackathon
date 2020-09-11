import React, { useEffect } from "react";
import { connect } from "react-redux";
import "./notification.scss";
import { getNotifications } from "../../../sagas/ActionCreator";
import LogoHeader from "../../organisms/LogoHeader";
import routeConfig from "../../../constants/routeConfig";
import { Link } from "react-router-dom";
import Username from "../../templates/Username";

const SECTION_HEADING = {
  assessmentPending: "Pending Assessment(s)",
  assessmentPassed: "Passes Assessment(s)",
  assessmentFailed: "Failed Assessment(s)",
  interviewPending: "Pending Interview(s)"
};

const Notification = ({
  getNotifications,
  userId,
  notificationHistory = {},
  history,
  userName
}) => {
  useEffect(() => {
    getNotifications(userId);
  }, [userId]);

  if (!Object.keys(notificationHistory).length) {
    return <div>No Notifications</div>;
  }

  return (
    <div className="notification-container">
      <div className="LogoHeaderCntnr">
        <LogoHeader redirectLink={routeConfig.home}>
          <div className="LogoHeaderLinks">
            <div className="linkItem">
              <Link to={routeConfig.home}>Job Fair</Link>
            </div>
            <div className="linkItem">
              <Link to={routeConfig.exibitorFloor}>Exibitor Floor</Link>
            </div>
            <Username history={history} userName={userName} isLoggedIn />
          </div>
        </LogoHeader>
      </div>
      {Object.keys(notificationHistory).map(key => {
        return (
          <div key={key} className={key}>
            <p className="title">{SECTION_HEADING[key]}</p>
            {notificationHistory[key].length === 0 && (
              <p className="empty">No {SECTION_HEADING[key]}</p>
            )}
            {notificationHistory[key].map(notificationObj => {
              return (
                <div className="card">
                  {/* <strong>{notificationObj.jobId}</strong>
                  <strong>{notificationObj.contestId}</strong>
                  <strong>{notificationObj.companyId}</strong> */}
                  <p className="bold">{notificationObj.companyName}</p>
                  <p className="jobTitle">{notificationObj.jobTitle}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const mSTP = ({ commonData }) => ({
  userId: commonData.userBasicDetails.id,
  notificationHistory: commonData.notifications,
  userName: commonData.userDetails.name
});

const mDTP = {
  getNotifications
};

export default connect(mSTP, mDTP)(Notification);
