import React, { memo } from "react";
import WAOptInContent from "../../molecules/WAOptInContent";
import tracker from "../../../analytics/tracker";
import { trackCleverTap } from "../../../utils/tracking";

import "./WhatsappCard.scss";

const WhatsappCard = memo(({ handleSendUpdateClick, className = "" }) => {
  const _handleSendUpdateClick = () => {
    tracker().on("event", {
      hitName: `applied_jobs$optin_clicked$whatsapp-optin`
    });
    trackCleverTap("WhatsApp_OptIn_Success");
    trackCleverTap("profile", { WhatsApp_OptIn: true, "MSG-whatsapp": true });
    handleSendUpdateClick();
  };
  return (
    <div className={`flatCard WhatsappCard ${className}`}>
      <WAOptInContent title="Get important updates like apply status on WhatsApp" />
      <button
        className="textButton viewedJobsCTA"
        onClick={_handleSendUpdateClick}
      >
        Send updates
      </button>
    </div>
  );
});

export default WhatsappCard;
