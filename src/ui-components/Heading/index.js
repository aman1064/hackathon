import React from "react";
import PropTypes from "prop-types";
import "./index.scss";

const Heading = props => {
  const { size, className, ...restProps } = props;

  return React.createElement(
    `h${size}`,
    { className, ...restProps },
    props.children
  );
};

Heading.propTypes = {
  size: PropTypes.oneOf(["1", "2", "3", "4", "5", "6"]),
  className: PropTypes.string,
  children: PropTypes.string.isRequired
};

Heading.defaultProps = {
  size: "6",
  className: ""
};

export default Heading;
