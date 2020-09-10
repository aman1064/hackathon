import React from "react";

import PageHeading from "../../atoms/PageHeading";

const LandscapeModeErr = () => (
  <div className="LandscapeModeErr">
    <div className="textCenter">
      <PageHeading el="h2" title="Please rotate your device" />
      <p className="LandscapeModeErr__HelpText">
        We do not support landscape mode, please use the app in portrait mode
        for best experience
      </p>
    </div>
  </div>
);

export default LandscapeModeErr;
