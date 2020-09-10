import React, { Component } from "react";

import Button from "../../../ui-components/Button";
import SocialMediaShare from "../SocialMediaShare/SocialMediaShare";

import isMobileDevice from "../../../utils/isMobileDevice";
import Urlconfig from "../../../constants/Urlconfig";
import navigatorShare from "./NavigatorSharePolyfill";

import "./ShareLink.scss";

export default class SocialShare extends Component {
  state = {
    isDesktopUser: false
  };

  handleShareClick = event => {
    const { shareTitle, shareUrl, onClickCB } = this.props;
    if (typeof onClickCB === "function") {
      onClickCB();
    }

    if (navigator.share) {
      navigator
        .share({
          text: shareTitle,
          url: shareUrl
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
          title: shareTitle,
          url: shareUrl
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

  handleHideSocialMediaShare = () => {
    this.setState({
      isDesktopUser: false
    });
  };

  render() {
    const { isDesktopUser } = this.state;
    const { shareTitle, className, shareUrl, buttonProps } = this.props;
    return (
      <div className={className}>
        {isDesktopUser && (
          <React.Fragment>
            <SocialMediaShare
              handleHideSocialMediaShare={this.handleHideSocialMediaShare}
              shareTitle={shareTitle}
              shareUrl={shareUrl}
            />
            <div
              className="outsideClick"
              onClick={this.handleHideSocialMediaShare}
            />
          </React.Fragment>
        )}
        <Button {...buttonProps} onClick={this.handleShareClick} />
      </div>
    );
  }
}
