import React from "react";

import LogoHeader from "../../../organisms/LogoHeader";
import Button from "../../../atoms/Button";
import noJobs from "../../../atoms/Icon/iconsList/Nojobs.svg";

import tracker from "../../../../analytics/tracker";

const resetDomainObj = {
  domain: null,
  experienceYear: null,
  experienceMonth: null,
  specialization: null
};

const OtherDomainScreen = ({
  firstScreenId,
  history,
  profile,
  postUpdateUserProfile,
  updateUserProfile
}) => {
  const handleRedirect = () => {
    tracker().on("event", {
      hitName: `registration$change_domain_clicked$change_domain_screen`
    });
    new Promise((resolve, reject) => {
      postUpdateUserProfile(resetDomainObj, resolve, reject);
    }).then(() => {
      sessionStorage.removeItem("DEx_displayScreen");
      updateUserProfile(resetDomainObj);
      history.push({
        pathname: `/registration/${firstScreenId}`,
        state: {
          resetOtherDomain: true
        }
      });
    });
  };
  return (
    <div>
      <LogoHeader isSmallLogo />
      <div className="OD__imageWrapper">
        <img height="144" src={noJobs} alt="finding jobs" />
      </div>
      <h2 className="OD__heading">
        We will soon start serving for {profile.domain && profile.domain.name}{" "}
        role
      </h2>
      <p className="OD__message">
        Meanwhile, see if there is anything you would like to update in your
        profile
      </p>
      <Button
        color="primary"
        type="link hasHover"
        className="OD__CTA"
        onClick={handleRedirect}
      >
        Select different area of work
      </Button>
    </div>
  );
};

export default OtherDomainScreen;
