import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

/* Here the override PropTypes of Route path b/c it gives warning
 */
Route.propTypes = {
  computedMatch: PropTypes.object,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  sensitive: PropTypes.bool,
  component: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  location: PropTypes.object
};

const PrivateRoute = ({ component: Component, accessToken, path, ...rest }) => {
  return (
    <Route
      path={path}
      render={props => {
        return accessToken ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: "/"
            }}
          />
        );
      }}
    />
  );
};
PrivateRoute.defaultProps = {
  accessToken: false
};

PrivateRoute.propTypes = {
  accessToken: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  path: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};

export default PrivateRoute;
