import React from "react";
import { recruiterUrl } from "../../../constants/config";
import {
  appRedirectUrl,
  appRedirectUrlFromAPI
} from "../../../configs/globalConfig";
import isMobileDevice from "../../../utils/isMobileDevice";
import Logo from "../../../assets/static/bigshyft-logo.svg";
import twitter from "../../../assets/images/png/twitter.png";
import linkedin from "../../../assets/images/png/linkedin.png";
import facebook from "../../../assets/images/png/facebook.png";
import twitterB from "../../../assets/images/png/twitterB.png";
import linkedinB from "../../../assets/images/png/linkedinB.png";
import facebookB from "../../../assets/images/png/facebookB.png";
import instaB from "../../../assets/images/png/instaB.png";

import tracker from "../../../analytics/tracker";

import "./AppFooter.scss";

const AppFooter = ({ gaCategory }) => (
  <footer className="AppFooter">
    <div className="AppFooter__ContentWrapper">
      <div className="AppFooter__LeftSec">
        <img className="AppFooter__Logo" alt="BigShyft Logo" src={Logo} />
        <p className="AppFooter__CopyRight">
          Copyright {new Date().getFullYear()}. All rights reserved
        </p>
      </div>
      <div className="AppFooter__Right">
        <ul className="AppFooter__Nav">
          <li>
            <a
              href={isMobileDevice() ? appRedirectUrl : appRedirectUrlFromAPI}
              target={isMobileDevice() ? undefined : "_blank"}
              rel="noopener noreferrer"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$get_the_app_clicked$footer`
                });
              }}
            >
              Get the app
            </a>
          </li>
          <li>
            <a
              href={recruiterUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$for_Recruiters_clicked$footer`
                });
              }}
            >
              For Recruiters
            </a>
          </li>
          <li>
            <a
              href="mailto:support@bigshyft.com"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$contact_us_clicked$footer`
                });
              }}
            >
              Contact us
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.bigshyft.com/policies/index.html"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$terms_of_service_clicked$footer`
                });
              }}
            >
              Terms of Service
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$team_blog_clicked$footer`
                });
              }}
              href="https://www.bigshyft.com/blog"
              target="_blank"
              rel="noopener noreferrer"
            >
              Team Blog
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$engineering_blog_clicked$footer`
                });
              }}
              href="https://engineering.bigshyft.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Engineering Blog
            </a>
          </li>
        </ul>
        <ul className="AppFooter__SocialNav">
          <li>
            <a
              href="https://twitter.com/bigshyft"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$twitter_clicked$footer`
                });
              }}
            >
              <img alt="twitter" src={twitter} />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/company/bigshyft/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$linkedin_clicked$footer`
                });
              }}
            >
              <img alt="linkedin" src={linkedin} />
            </a>
          </li>
          <li>
            <a
              href="https://www.facebook.com/bigshyft"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                tracker().on("event", {
                  hitName: `${gaCategory}$facebook_clicked$footer`
                });
              }}
            >
              <img alt="facebook" src={facebook} />
            </a>
          </li>
        </ul>
      </div>
      <p className="AppFooter__InfoEdge">
        BigShyft is brought to you from the house of Info Edge (India) Ltd.
      </p>
    </div>
  </footer>
);

const ClassyFooter = ({ gaCategory }) => (
  <footer className="ClassyFooter">
    <div className="logoCntnr">
      <img className="Classy__Logo" alt="BigShyft Logo" src={Logo} />
      <p className="footerDesc">Job search platform for top developers</p>
      <ul className="ClassyFooter__SocialNav">
        <li>
          <a
            href="https://www.linkedin.com/company/bigshyft/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$linkedin_clicked$Footer`
              });
            }}
          >
            <img alt="linkedin" src={linkedinB} />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/bigshyft"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$twitter_clicked$Footer`
              });
            }}
          >
            <img alt="twitter" src={twitterB} />
          </a>
        </li>

        <li>
          <a
            href="https://www.facebook.com/bigshyft"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$facebook_clicked$Footer`
              });
            }}
          >
            <img alt="facebook" src={facebookB} />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/bigshyft/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$insta_clicked$Footer`
              });
            }}
          >
            <img alt="instagram" src={instaB} />
          </a>
        </li>
      </ul>
    </div>
    <div className="sitemap">
      <h4>SITEMAP</h4>
      <ul>
        <li>
          <a
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$for_jobseeker_clicked$Footer`
              });
            }}
            href="/"
          >
            For Jobseekers
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$for_employers_clicked$Footer`
              });
            }}
            href="https://recruiter.bigshyft.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            For Employers
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$about_infoedge_clicked$Footer`
              });
            }}
            href="http://infoedge.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            About InfoEdge
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$team_blog_clicked$Footer`
              });
            }}
            href="https://www.bigshyft.com/blog"
            target="_blank"
            rel="noopener noreferrer"
          >
            Team Blog
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              tracker().on("event", {
                hitName: `${gaCategory}$terms_of_service_clicked$Footer`
              });
            }}
            href="/policies/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
        </li>
      </ul>
      <div className="aboutCntnr">
        <p>Copyright {new Date().getFullYear()}. All Rights Reserved.</p>
        <p>
          BigShyft is brought to you from the house of Info Edge (India) Ltd.
        </p>
      </div>
    </div>
  </footer>
);

const Footer = ({ gaCategory, variation = "app" }) => {
  if (variation === "classy") {
    return <ClassyFooter gaCategory={gaCategory} />;
  } else {
    return <AppFooter gaCategory={gaCategory} />;
  }
};

export default Footer;
