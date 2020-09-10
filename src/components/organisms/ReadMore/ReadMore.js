import React, { Component } from "react";
import PropTypes from "prop-types";

import Button from "../../atoms/Button";
import { trackCleverTap } from "../../../utils/tracking";
import tracker from "../../../analytics/tracker";

import "./ReadMore.scss";

class ReadMore extends Component {
  state = {
    expanded: false
  };

  toggleExpand = () => {
    const {
      trackCleverTapName,
      trackCleverTapParameters,
      trackerCategory,
      trackerLabel,
      trackerValue,
      trackerAction
    } = this.props;
    if (trackerCategory && trackerLabel && trackerValue && trackerAction) {
      this.state.expanded
        ? tracker().on("event", {
            hitName: `${trackerCategory}$${trackerAction}_show_less_clicked$${trackerLabel}$${trackerValue}`
          })
        : tracker().on("event", {
            hitName: `${trackerCategory}$${trackerAction}_read_more_clicked$${trackerLabel}$${trackerValue}`
          });
    }

    if (trackCleverTapName) {
      trackCleverTap(trackCleverTapName, trackCleverTapParameters);
    }

    this.setState({
      expanded: !this.state.expanded
    });
  };

  render() {
    const shortenedStr = this.props.str.slice(0, this.props.displayChars) + "…",
      displayStr = this.state.expanded ? this.props.str : shortenedStr,
      buttonText = this.state.expanded ? "show less" : "read more",
      extraButtonClass = this.state.expanded
        ? this.props.customButtonClassExpanded
        : this.props.customButtonClass;

    return this.props.str.length > this.props.displayChars ? (
      <p className={`ReadMore inherit_styles ${this.props.customClass}`}>
        {displayStr}
        <Button
          onClick={this.toggleExpand}
          type="link"
          size="small"
          className={`${extraButtonClass} marginLeft_4`}
        >
          {buttonText}
        </Button>
      </p>
    ) : (
      <p className={`inherit_styles ${this.props.customClass}`}>
        {this.props.str}
      </p>
    );
  }
}

ReadMore.defaultProps = {
  customClass: "",
  customButtonClass: "",
  customButtonClassExpanded: ""
};
ReadMore.propTypes = {
  str: PropTypes.string.isRequired,
  displayChars: PropTypes.number.isRequired,
  customClass: PropTypes.string,
  customButtonClass: PropTypes.string,
  customButtonClassExpanded: PropTypes.string
};
export default ReadMore;
