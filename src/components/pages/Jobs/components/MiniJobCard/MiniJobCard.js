import React, { Component } from "react";
import PropTypes from "prop-types";
import PageHeading from "../../../../atoms/PageHeading";
import routeConfig from "../../../../../constants/routeConfig";
import globalConfig from "../../../../../configs/globalConfig";
import tracker from "../../../../../analytics/tracker";
import { getPublicJdURL } from "../../../../../utils/getUrl";
import { filterJobDetailsForCleverTap } from "../../../../../utils/tracking";

import {
  BookmarkSelectedIcon,
  BookmarkUnselectedIcon
} from "../../../../atoms/Icon/icons";
import { getImageObserver } from "../../../../../utils/intersectionUtil";

class MiniJobCard extends Component {
  componentDidMount() {
    this.imageObserver = getImageObserver();
    const arr = document.querySelectorAll(".Minicard__Logo");
    arr.forEach(v => {
      if (this.imageObserver) {
        this.imageObserver.observe(v);
      }
    });
  }

  handleImageLoadError = e => {
    e.target.src = globalConfig.fallbackImageSrc;
    e.target.classList.add("outerBorder");
  };

  redirectToKnowMore = e => {
    tracker().on("event", {
      hitName: `${this.props.trackGAEventName}`
    });
    if (this.props.trackCleverTapName && this.props.trackCleverTapParameters) {
      tracker().on("ctapEvent", {
        hitName: this.props.trackCleverTapName,
        payload: {
          ...filterJobDetailsForCleverTap(this.props.trackCleverTapParameters)
        }
      });
    }
    e.stopPropagation();
    if (this.props.redirectToPublicJd) {
      const url = getPublicJdURL(
        this.props.jobDetail.jobId,
        this.props.jobDetail.designation
      );
      this.props.history.push({ pathname: url, search: "?contest=true" });
    } else {
      this.props.history.push({
        pathname: routeConfig.jobs,
        state: { redirectTo: this.props.location.pathname },
        search: `?jobId=${this.props.jobDetail.jobId}`
      });
    }
  };

  handleRemoveJobClick = e => {
    e.stopPropagation();
    this.props.onRemoveJobClick(this.props.jobDetail.jobId);
  };

  handleBookmarkClick = e => {
    e.stopPropagation();
    this.props.onBookmarkClick();
  };

  handleRemoveBookmarkClick = e => {
    e.stopPropagation();
    this.props.onRemoveBookmarkClick();
  };

  render() {
    const { bookmarkedDate } = this.props.jobDetail;
    const { hideBookMark, hideNotRelevant } = this.props;
    return (
      <div className="flatCard MiniJobCard" onClick={this.redirectToKnowMore}>
        {hideBookMark === false && (
          <button
            className={`MiniJobCard__BookmarkCTA ${
              bookmarkedDate ? "isBookmarked" : ""
            }`}
            onClick={
              bookmarkedDate
                ? this.handleRemoveBookmarkClick
                : this.handleBookmarkClick
            }
            type="submit"
          >
            {bookmarkedDate ? (
              <BookmarkSelectedIcon />
            ) : (
              <BookmarkUnselectedIcon />
            )}
          </button>
        )}
        <div className="Minicard__Logo">
          <img
            width="32"
            src={globalConfig.fallbackImageSrc}
            alt={this.props.jobDetail.companyName}
            onError={this.handleImageLoadError}
            data-src={this.props.jobDetail.companyLogoUrl}
          />
        </div>

        <div className="MiniJobCard__DescriptionWrapper">
          <PageHeading
            el="h2"
            title={this.props.jobDetail.designation}
            className="ellipsis"
          />
          <p className="fontSize_13 semibold ellipsis">
            {this.props.jobDetail.companyName}
          </p>
          <p className="fontSize_13 ellipsis">
            {this.props.jobDetail.cities.join(", ")}
          </p>
        </div>
        <div className="fullWidth spreadHr MiniJobCard__ActionsWrapper">
          {hideNotRelevant === false && (
            <button
              className="MiniJobCard__FooterCTA"
              onClick={this.handleRemoveJobClick}
              type="submit"
            >
              Not relevant
            </button>
          )}
          <button
            className="MiniJobCard__FooterCTA"
            onClick={this.redirectToKnowMore}
            type="submit"
          >
            Know more
          </button>
        </div>
      </div>
    );
  }
}
MiniJobCard.propTypes = {
  onRemoveJobClick: PropTypes.func,
  onRemoveBookmarkClick: PropTypes.func,
  trackGAEventName: PropTypes.string,
  trackCleverTapName: PropTypes.string,
  redirectToPublicJd: PropTypes.bool,
  jobDetail: PropTypes.object,
  history: PropTypes.object,
  trackCleverTapParameters: PropTypes.object,
  location: PropTypes.object,
  hideBookMark: PropTypes.bool,
  hideNotRelevant: PropTypes.bool,
  onBookmarkClick: PropTypes.func
};

MiniJobCard.defaultProps = {
  onRemoveJobClick: () => {},
  onRemoveBookmarkClick: () => {},
  trackGAEventName: "",
  trackCleverTapName: "",
  redirectToPublicJd: false,
  jobDetail: {},
  history: {},
  trackCleverTapParameters: {},
  location: {},
  hideBookMark: false,
  hideNotRelevant: false,
  onBookmarkClick: () => {}
};
export default MiniJobCard;
