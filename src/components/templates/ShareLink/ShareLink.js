import React, { Component } from "react";
import navigatorShare from "./NavigatorSharePolyfill";
import { ShareIcon } from "../../atoms/Icon";
import SocialMediaShare from "../SocialMediaShare/SocialMediaShare";
import isMobileDevice from "../../../utils/isMobileDevice";
import "./ShareLink.scss";
import Urlconfig from "../../../constants/Urlconfig";
import tracker from "../../../analytics/tracker";

export default class ShareLink extends Component {
  state = {
    isDesktopUser: false
  };
  getShareUrl = () => {
    const { jobId, jobTitle } = this.props;
    let modifiedJobTitle = jobTitle.split(" ").join("-");
    modifiedJobTitle = modifiedJobTitle.replace(
      /[&\/\\#,+()!^\"'`[\]@$%*?<>{} =;:~._]/g,
      "-"
    );
    const url = `${Urlconfig.codeBase}/jobs/jd/${jobId}/${modifiedJobTitle}`;
    return url;
  };
  handleShareClick = event => {
    const { jobTitle, jobId, trackerCategory } = this.props;
    const url = this.getShareUrl();

    tracker().on("event", {
      hitName: `${trackerCategory}$jd_share_clicked$detailed_jd$${jobId}`
    });

    if (navigator.share) {
      navigator
        .share({
          text: jobTitle,
          url: url
        })
        .then(res => {
          console.info("Success", res);
        })
        .catch(err => {
          console.info("error", err);
        });
    } else {
      if (isMobileDevice()) {
        navigatorShare({
          title: jobTitle,
          url
        })
          .then(res => {
            console.info("Success", res);
          })
          .catch(err => {
            console.info("error", err);
          });
      } else {
        this.setState({
          isDesktopUser: true
        });
      }
    }
  };
  handleHideSocialMediaShare = ({ type, jobId, trackerCategory }) => {
    const url = this.getShareUrl();
    if (type) {
      tracker().on("event", {
        hitName: `${trackerCategory}$${type}$detailed_jd$${jobId}`
      });
    }
    this.setState({
      isDesktopUser: false
    });
  };
  render() {
    const { isDesktopUser } = this.state;
    const { jobTitle, className, jobId, trackerCategory } = this.props;
    return (
      <div className={className}>
        {isDesktopUser ? (
          <React.Fragment>
            <SocialMediaShare
              handleHideSocialMediaShare={this.handleHideSocialMediaShare}
              shareTitle={jobTitle}
              shareUrl={this.getShareUrl()}
              jobId={jobId}
              trackerCategory={trackerCategory}
            />
            <div
              className="outsideClick"
              onClick={this.handleHideSocialMediaShare}
            />
          </React.Fragment>
        ) : (
          <button onClick={this.handleShareClick}>
            <ShareIcon size={22} />
          </button>
        )}
      </div>
    );
  }
}
