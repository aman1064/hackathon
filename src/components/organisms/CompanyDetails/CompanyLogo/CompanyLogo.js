import React from "react";
import PropTypes from "prop-types";

import globalConfig from "../../../../configs/globalConfig";

import "./companyLogo.scss";

const handleImageLoadError = e => {
  e.target.src = globalConfig.fallbackImageSrc;
  e.target.height = 60;
  e.target.classList.add("outerBorder");
};

function CompanyLogo({ src, companyName }) {
  return (
    <img
      alt={companyName}
      className="companyLogo"
      src={src}
      onError={handleImageLoadError}
    />
  );
}

CompanyLogo.defaultProps = {
  companyName: ""
};
CompanyLogo.propTypes = {
  src: PropTypes.string.isRequired,
  companyName: PropTypes.string
};
export default CompanyLogo;
