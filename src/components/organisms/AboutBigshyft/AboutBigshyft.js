import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "../../../ui-components/Button";

import ShowcaseTalent from "../../../assets/images/svg/Showcase_talent.svg";
import AcceptOffer from "../../../assets/images/svg/Accept_offer.svg";
import Apply from "../../../assets/images/svg/Apply.svg";

import routeConfig from "../../../constants/routeConfig";
import tracker from "../../../analytics/tracker";

import "./AboutBigshyft.scss";

const AboutBigshyft = ({ isLoggedin, queryParams = "", hitName }) => {
  const trackCTAClick = () => {
    if (hitName) {
      tracker().on("event", {
        hitName
      });
    }
  };

  return (
    <aside className="aboutBigshyft">
      <h3>How BigShyft works</h3>
      <div>
        <div className="aboutItem showcase">
          <img src={ShowcaseTalent} alt="showcase talent" />
          <h4 className="aboutHeading">Showcase your talent</h4>
          <p className="aboutDesc">
            Showcase your skill set, experience and career interests on your
            BigShyft profile
          </p>
        </div>
        <div className="aboutItem apply">
          <img src={Apply} alt="apply to jobs" />
          <h4 className="aboutHeading">Apply to handpicked jobs</h4>
          <p className="aboutDesc">
            Apply to our handpicked jobs and hear back from recruiters
          </p>
        </div>
        <div className="aboutItem accept">
          <img src={AcceptOffer} alt="accept offer" />
          <h4 className="aboutHeading">Accept Offer</h4>
          <p className="aboutDesc">
            Evaluate the opportunities, get direct interviews and choose the
            right offer
          </p>
        </div>
      </div>
      <Button className="aboutCTA">
        <Link
          onClick={trackCTAClick}
          to={
            isLoggedin ? `${routeConfig.jobs}${queryParams}` : `/${queryParams}`
          }
        >
          {isLoggedin ? "Continue to BigShyft" : "Get Started"}
        </Link>
      </Button>
    </aside>
  );
};

AboutBigshyft.propTypes = {
  isLoggedin: PropTypes.bool,
  queryParams: PropTypes.string,
  hitName: PropTypes.string
};

AboutBigshyft.defaultProps = {
  isLoggedin: false,
  queryParams: "",
  hitName: ""
};

export default AboutBigshyft;
