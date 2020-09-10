import React from "react";
import PropTypes from "prop-types";
import KnowMoreView from "./KnowMoreView";

import routeConfig from "../../../../constants/routeConfig";

const CommonJD = props => {
  const { pathname } = props.location;

  return (
    <KnowMoreView
      {...props}
      renderBack={pathname === routeConfig.jobs}
      isConsentFlow={pathname === routeConfig.consentJd}
    />
  );
};
CommonJD.propTypes = {
  location: PropTypes.object
};

CommonJD.defaultProps = {
  location: {}
};

export default CommonJD;
