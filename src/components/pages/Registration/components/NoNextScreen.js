import React from "react";
import bulbImage from "../../../../assets/images/png/bulb.png";
import Button from "../../../atoms/Button";
import "../../Profile/Profile.scss";

const NoNextScreen = props => (
  <div className="profile">
    <div className="profile__imageWrapper">
      <img height="150" width="262" src={bulbImage} alt="new jobs" />
    </div>
    <h2 className="textCenter">Oops!</h2>
    <p className="profile__message">
      There seems to be a problem with loading the page. Try loading the page
      again.
    </p>

    <div className="marginTop_36 textAlign_center">
      <Button className="width_186" onClick={props.getApiData}>
        Retry
      </Button>
    </div>
  </div>
);

export default NoNextScreen;
