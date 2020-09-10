import React, { Component } from "react";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import * as iconObj from "../../atoms/Icon";
import { trackCleverTap } from "../../../utils/tracking";
import routeConfig from "../../../constants/routeConfig";
import tracker from "../../../analytics/tracker";

function getPath(path) {
  let redirectToPath = path.split("/");
  redirectToPath.shift();
  redirectToPath = redirectToPath.join("");
  return redirectToPath;
}
export class StatusNavItem extends Component {
  state = {
    redirectToPath: ""
  };
  static getDerivedStateFromProps = (nextProps, state) => {
    const {
      location: { pathname },
      statusNavRoute
    } = nextProps;
    const redirectToPath = getPath(pathname);
    if (redirectToPath !== state.redirectToPath && statusNavRoute) {
      if (redirectToPath.includes("jobs")) {
        nextProps.setStatusNavRoute({
          prevJobsRoute: redirectToPath,
          prevProfileRoute: statusNavRoute.prevProfileRoute,
          prevStatusNavRoute: "jobs"
        });
      } else if (redirectToPath.includes("profile")) {
        nextProps.setStatusNavRoute({
          prevJobsRoute: statusNavRoute.prevJobsRoute,
          prevProfileRoute: redirectToPath,
          prevStatusNavRoute: "profile"
        });
      } else {
        nextProps.setStatusNavRoute({
          prevJobsRoute: statusNavRoute.prevJobsRoute,
          prevProfileRoute: statusNavRoute.prevProfileRoute,
          prevStatusNavRoute: redirectToPath
        });
      }
    }

    return { redirectToPath };
  };
  handleNavItemClick = e => {
    window.scrollTo(0, 0);
    const {
      config: { title, cleverTap }
    } = this.props;
    tracker().on("event", {
      hitName: `browse$${title.toLowerCase()}_clicked$footer`
    });
    trackCleverTap(cleverTap);
    if (e.currentTarget.href.includes(routeConfig.jobs)) {
      sessionStorage.setItem("jobsNavClicked", true);
    }
  };
  updateStatusNavItemPath = (statusNavRoute, path) => {
    if (
      statusNavRoute &&
      statusNavRoute.prevStatusNavRoute !== "jobs" &&
      path === routeConfig.jobs
    ) {
      switch (statusNavRoute.prevJobsRoute) {
        case "jobsviewedJobs":
          path = routeConfig.viewedJobs;
          break;
        case "jobssavedJobs":
          path = routeConfig.savedJobs;
          break;
        case "jobs":
        default:
          path = routeConfig.jobs;
      }
    }
    if (
      statusNavRoute &&
      statusNavRoute.prevStatusNavRoute !== "profile" &&
      path === routeConfig.profile
    ) {
      switch (statusNavRoute.prevProfileRoute) {
        case "profilesetting":
          path = routeConfig.profileSetting;
          break;
        case "profile":
        default:
          path = routeConfig.profile;
      }
    }
    return path;
  };

  render() {
    const {
        location: { pathname },
        config: { icon, title, enabled, activePath },
        statusNavRoute
      } = this.props,
      CustomIcon = iconObj[icon + "Icon"],
      CustomIconActive = iconObj[icon + "_activeIcon"];
    let {
      config: { path }
    } = this.props;
    const redirectToPath = getPath(pathname);
    path = this.updateStatusNavItemPath(statusNavRoute, path);
    const isActivePath =
      activePath &&
      activePath.toLowerCase().includes(redirectToPath.toLowerCase());

    return enabled ? (
      <NavLink
        exact
        className={`statusNav_link ${
          isActivePath ? "statusNav_link_activePath" : ""
        }`}
        to={path}
        onClick={this.handleNavItemClick}
      >
        {!isActivePath && <CustomIcon />}
        {isActivePath && <CustomIconActive />}
        <span>{title}</span>
      </NavLink>
    ) : (
      ""
    );
  }
}

StatusNavItem.defaultProps = {
  config: {
    enabled: false,
    path: "",
    icon: "",
    title: ""
  }
};
StatusNavItem.propTypes = {
  config: PropTypes.shape({
    enabled: PropTypes.bool,
    path: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string
  })
};
export default withRouter(StatusNavItem);
