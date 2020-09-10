import React from "react";
import { Link } from "react-router-dom";
// import Logo from "../../../assets/static/bigshyft-logo.svg";
// import LogoSmall from "../../../assets/images/png/bigshyft_logo_small.png";
import LogoNative from "../../../assets/images/svg/logo_covid.svg";
import LogoSmall from "../../../assets/images/svg/logo_small_covid.svg";
import LogoSMGOWhite from "../../../assets/images/svg/logo_smgo_white.svg";
import LogoSMGODark from "../../../assets/images/svg/logo_smgo_dark.svg";

import tracker from "../../../analytics/tracker";

import "./LogoHeader.scss";
import getAccessToken from "../../../utils/getAccessToken";

const onLogoHeaderClick = () => {
  window.location.reload();
};

const trackLogoClick = hitName => {
  tracker().on("event", {
    hitName
  });
};

const LogoHeader = ({
  isSmallLogo,
  children,
  className,
  redirectLink,
  isErrorBoundary,
  clickHandler,
  hitName,
  smgoLogo,
  logoTone
}) => {
  let Logo = LogoNative;
  const accessToken = getAccessToken();
  if (smgoLogo) {
    if (logoTone === "white") {
      Logo = LogoSMGOWhite;
    } else {
      Logo = LogoSMGODark;
    }
  }
  return (
    <div className={`LogoHeader covid_logo ${className} `}>
      {!accessToken || redirectLink ? (
        <Link
          to={redirectLink || "/"}
          onClick={() => {
            if (hitName) {
              trackLogoClick(hitName);
            }

            if (clickHandler) {
              clickHandler();
            } else if (isErrorBoundary) {
              onLogoHeaderClick();
            }
          }}
        >
          <img
            className={`LogoHeader__Logo ${isSmallLogo ? "isSmall" : ""}`}
            src={isSmallLogo ? LogoSmall : Logo}
            alt="BigShift Logo"
          />
        </Link>
      ) : (
        <img
          className={`LogoHeader__Logo ${isSmallLogo ? "isSmall" : ""}`}
          src={isSmallLogo ? LogoSmall : Logo}
          alt="BigShift Logo"
        />
      )}
      {children}
    </div>
  );
};

export default LogoHeader;
