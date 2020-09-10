import React, { Component } from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton
} from "../../../constants/react-share";

import {
  FacebookIcon,
  WhatsUpIcon,
  ShareIcon,
  LinkIcon,
  LinkedinSocialShareIcon,
  TwitterIcon,
  EmailIcon
} from "../../atoms/Icon";
import tracker from "../../../analytics/tracker";
import "./SocialMediaShare.scss";

export default class SocialMediaShare extends Component {
  handleCopyLink = shareUrl => e => {
    if (shareUrl.includes("/jobs/jd")) {
      tracker().on("event", {
        hitName: `Public_JD$jd_share_copylink_clicked$detailed_jd$${
          this.props.jobId
        }`
      });
    }
    const dummyElement = document.createElement("textarea");
    document.body.appendChild(dummyElement);
    dummyElement.value = shareUrl;
    dummyElement.select();
    document.execCommand("copy");
    document.body.removeChild(dummyElement);
    const tooltip = document.getElementById("linkTooltip");
    tooltip.innerHTML = "Link Copied";
  };
  handleResetToolTip = () => {
    const tooltip = document.getElementById("linkTooltip");
    tooltip.innerHTML = "Copy Link";
  };
  render() {
    const {
      shareTitle,
      handleHideSocialMediaShare,
      jobId,
      trackerCategory,
      shareUrl
    } = this.props;

    return (
      <div className="SocialMediaShare" onClick={e => e.stopPropagation()}>
        <div className="SocialMediaShare__some-network  SocialMediaShare__some-network__share-button_container">
          <ShareIcon
            size={18}
            viewBox="0 0 26 26"
            className="SocialMediaShare__some-network__custom-icon  SocialMediaShare__some-network__shareIcon"
            onClick={handleHideSocialMediaShare}
          />
        </div>

        <div className="SocialMediaShare__some-network">
          <WhatsappShareButton
            url={shareUrl}
            title={shareTitle}
            windowWidth={750}
            windowHeight={600}
            beforeOnClick={handleHideSocialMediaShare.bind(null, {
              type: "jd_share_whatsapp_clicked",
              jobId,
              trackerCategory
            })}
            className="SocialMediaShare__some-network__share-button"
          >
            <WhatsUpIcon
              size={18}
              className="SocialMediaShare__some-network__custom-icon"
            />
          </WhatsappShareButton>
        </div>
        <div className="SocialMediaShare__some-network">
          <LinkedinShareButton
            url={shareUrl}
            windowWidth={750}
            windowHeight={600}
            beforeOnClick={handleHideSocialMediaShare.bind(null, {
              type: "jd_share_linkedin_clicked",
              jobId,
              trackerCategory
            })}
            className="SocialMediaShare__some-network__share-button"
          >
            <LinkedinSocialShareIcon
              size={18}
              className="SocialMediaShare__some-network__custom-icon"
            />
          </LinkedinShareButton>
        </div>
        <div className="SocialMediaShare__some-network">
          <TwitterShareButton
            url={shareUrl}
            title={shareTitle}
            windowWidth={750}
            windowHeight={600}
            beforeOnClick={handleHideSocialMediaShare.bind(null, {
              type: "jd_share_twitter_clicked",
              jobId,
              trackerCategory
            })}
            className="SocialMediaShare__some-network__share-button"
          >
            <TwitterIcon
              size={18}
              className="SocialMediaShare__some-network__custom-icon"
            />
          </TwitterShareButton>
        </div>

        <div className="SocialMediaShare__some-network">
          <FacebookShareButton
            url={shareUrl}
            quote={shareTitle}
            windowWidth={750}
            windowHeight={600}
            beforeOnClick={handleHideSocialMediaShare.bind(null, {
              type: "jd_share_facebook_clicked",
              jobId,
              trackerCategory
            })}
            className="SocialMediaShare__some-network__share-button"
          >
            <FacebookIcon
              size={18}
              className="SocialMediaShare__some-network__custom-icon"
            />
          </FacebookShareButton>
        </div>
        <div className="SocialMediaShare__some-network">
          <EmailShareButton
            url={shareUrl}
            subject={shareTitle}
            windowWidth={750}
            windowHeight={600}
            beforeOnClick={handleHideSocialMediaShare.bind(null, {
              type: "jd_share_email_clicked",
              jobId,
              trackerCategory
            })}
            className="SocialMediaShare__some-network__share-button"
          >
            <EmailIcon
              size={18}
              className="SocialMediaShare__some-network__custom-icon"
            />
          </EmailShareButton>
        </div>
        <div
          className="SocialMediaShare__some-network tooltip"
          onClick={this.handleCopyLink(shareUrl)}
          onMouseLeave={this.handleResetToolTip}
        >
          <LinkIcon
            size={18}
            className="SocialMediaShare__some-network__custom-icon"
          />
          <span className="toolTipText" id="linkTooltip">
            Copy Link
          </span>
        </div>
      </div>
    );
  }
}
