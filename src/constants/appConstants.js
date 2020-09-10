import routeConfig from "./routeConfig";

const APPVARS = {
  NO_ACCESS_TOKEN_ROUTES: [
    routeConfig.root,
    routeConfig.signup,
    routeConfig.login,
    routeConfig.forgotPassword
  ],
  APLHANUMERIC_REGEX: /\d+/
};

export default APPVARS;
