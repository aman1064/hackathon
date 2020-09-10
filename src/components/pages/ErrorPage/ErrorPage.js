import React, { Fragment } from "react";
import queryString from "query-string";

import Button from "../../atoms/Button";
import LogoHeader from "../../organisms/LogoHeader";

import brokenLinkImg from "../../../assets/images/png/bulb.png";
import globalConfig from "../../../configs/globalConfig";

import "./ErrorPage.scss";

const handleImageLoadError = e => {
  e.target.src = globalConfig.fallbackImageSrc;
  e.target.classList.add("largeImageFallback");
};

const ErrorPage = ({ location, isOffline, isErrorBoundary, history }) => {
  const message =
    location && location.search && queryString.parse(location.search).message;
  return (
    <div className="ErrorPage">
      <LogoHeader redirectLink="/" isErrorBoundary={isErrorBoundary} />
      <div className="ErrorPage__ImgWrapper">
        <img
          className="ErrorPage__Img"
          src={brokenLinkImg}
          alt="broken link"
          onError={handleImageLoadError}
        />
      </div>
      {isOffline ? (
        <div className="ErrorPage__NoNetWrapper">
          <h2 className="textCenter">Oops!</h2>
          <p className="ErrorPage__NoNetWrapper-Message">
            There seems a problem loading the page. Please try loading page
            again.
          </p>
          <div className="marginTop_36 textAlign_center">
            <Button
              className="width_186"
              onClick={() => {
                history.push(location.pathname);
              }}
              appearance="primary"
              type="button"
            >
              Retry
            </Button>
          </div>
        </div>
      ) : (
        <Fragment>
          <h2 className="textCenter">Oops!</h2>
          <p className="ErrorPage__NoNetWrapper-Message">
            {(location && location.state && location.state.message) ||
              message ||
              "There seems a problem loading the page. Please try loading page again."}
          </p>
        </Fragment>
      )}
    </div>
  );
};

export default ErrorPage;
