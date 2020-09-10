import React from "react";
import PropTypes from "prop-types";
import "./HelpText.scss";

function HelpText({ text, className }) {
  return <p className={`HelpText ${className}`}>{text}</p>;
}
HelpText.defaultProps = {
  className: ""
};
HelpText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};
export default HelpText;
