import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import "./index.css";
import routeConfig from "../../../constants/routeConfig";
import {userLogout} from "../../../sagas/ActionCreator";

const Logout = props => {
  const logoutUser = () => {
    props.userLogout();
    props.history.push(routeConfig.login);
  };

  return (
    <>
      {(props.isLoggedIn && (
        <div className="username-wrapper">
          <div className="username linkItem">Hi {props.userName}</div>
          <div className="user-dropdown-wrapper">
            <ul className="user-dropdown hide">
              <li onClick={logoutUser}>Logout</li>
            </ul>
          </div>
        </div>
      )) ||
        ""}
    </>
  );
};

Logout.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(null, { userLogout })(Logout);
