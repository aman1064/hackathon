import React, {useEffect} from "react";
import { connect } from "react-redux";
import "./notification.scss";
import {getNotifications} from "../../../sagas/ActionCreator";

const Notification = ({getNotifications, userId, notificationHistory}) => {
    useEffect(() => {
        getNotifications(userId)
    }, [userId]);

    if(!Object.keys(notificationHistory).length) {
        return <div>No Notifications</div>
    }

    return (
        <div className="notification-container">
            {
                Object.keys(notificationHistory).map((key) => {
                    return <div key={key} className={key}>
                        <p>{key}</p>
                        {
                            notificationHistory[key].map((notificationObj) => {
                                return <div className="card">
                                    <strong>{notificationObj.jobId}</strong>
                                    <strong>{notificationObj.contestId}</strong>
                                    <strong>{notificationObj.companyId}</strong>
                                    <strong>{notificationObj.companyName}</strong>
                                    <strong>{notificationObj.jobTitle}</strong>
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    )
}


const mSTP = ({commonData}) => ({
    userId: commonData.userBasicDetails.id,
    notificationHistory: commonData.notifications
});

const mDTP = {
    getNotifications
};

export default connect(mSTP, mDTP)(Notification);
