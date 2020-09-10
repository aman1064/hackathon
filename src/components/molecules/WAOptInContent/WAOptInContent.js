import React from "react";
import { WhatsUpIcon } from "../../atoms/Icon";
import HelpText from "../../atoms/HelpText";
import "./index.scss";
const WAOptInContent = ({ title }) => (
  <div className="WACard_Content">
    <WhatsUpIcon
      size={20}
      className="SocialMediaShare__some-network__custom-icon"
    />
    <div>
      <h1 className="WATitle">{title}</h1>
      <HelpText
        key="watsappContent"
        text={"You may choose to opt out anytime"}
        className="marginTop_8 color_mid_night"
      />
    </div>
  </div>
);

export default WAOptInContent;
