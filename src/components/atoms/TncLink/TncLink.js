import React from "react";
import { trackCleverTap } from "../../../utils/tracking";
import tracker from "../../../analytics/tracker";

const trackTncClick = () => {
  trackCleverTap("TnCClicked_SignUpScreen");
  tracker().on("event", {
    hitName: `registration$tnc_clicked$signup_screen`
  });
};

function TnCLink({ className, redirectTo, customClass }) {
  return (
    <div className={`${className} ${customClass} paddingTop_7`}>
      <p>
        By continuing, you agree to the{" "}
        <a
          href={redirectTo}
          target="_blank"
          rel="noopener noreferrer"
          className={`underline cursor_pointer`}
          onClick={trackTncClick}
        >
          T&amp;C
        </a>
      </p>
    </div>
  );
}

export default TnCLink;
