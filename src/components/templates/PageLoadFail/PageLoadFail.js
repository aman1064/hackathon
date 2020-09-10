import React from "react";

import Button from "../../atoms/Button";

import brokenLinkImg from "../../../assets/images/png/bulb.png";

import "./PageLoadFail.scss";

const PageLoadFail = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <div className="PageLoadFail">
      <div className="imgCntnr">
        <img src={brokenLinkImg} alt="unplugged" />
      </div>
      <div className="textCntnr">
        <h1>We tried to communicate, but the server didn’t respond</h1>
        <p className="desc">You know what to do in this situation</p>
        <Button onClick={reloadPage}>Reload this page</Button>
      </div>
    </div>
  );
};

export default PageLoadFail;
