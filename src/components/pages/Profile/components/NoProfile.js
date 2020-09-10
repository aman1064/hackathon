import React from "react";
import { Link } from "react-router-dom";

import bulbImage from "../../../../assets/images/png/bulb.png";
import Button from "../../../atoms/Button";
import Icon from "../../../atoms/Icon";
import routeConfig from "../../../../constants/routeConfig";

const NoProfile = props => (
  <fragment>
    <div className="profile__navBar">
      <Button component={Link} to={routeConfig.profileSetting}>
        <Icon type="settings" customClass="fontSize_24" />
      </Button>
    </div>
    <div className="profile__imageWrapper">
      <img height="160" src={bulbImage} alt="new jobs" />
    </div>
    <h2 className="textCenter">Oops!</h2>
    <p className="profile__message">
      {"There seems to be a problem in loading this page. Try reloading again."}
    </p>
    <div className="marginTop_36 textAlign_center">
      <Button
        appearance="secondary"
        className="width_135"
        onClick={props.getApiData}
      >
        Retry
      </Button>
    </div>
  </fragment>
);

export default NoProfile;
