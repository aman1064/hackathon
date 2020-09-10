import React from "react";
import PropTypes from "prop-types";

function PageHeading({ className, title, el, onClick, name }) {
  switch (el) {
    case "h2":
      return (
        <h2 className={className} onClick={onClick} name={name}>
          {title}
        </h2>
      );
    case "h1":
    default:
      return (
        <h1 className={className} onClick={onClick} name={name}>
          {title}
        </h1>
      );
  }
}

PageHeading.defaultProps = {
  className: ""
};
PageHeading.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired
};
export default React.memo(PageHeading);
