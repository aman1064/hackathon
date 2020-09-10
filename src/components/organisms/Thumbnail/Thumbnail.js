import React from "react";

import "./Thumbnail.scss";

const Thumbnail = ({ icon: Icon, iconProps, heading, description }) => (
  <div className="Thumbnail">
    <Icon {...iconProps} />
    <h3 className="Thumbnail__Heading">{heading}</h3>
    <p className="Thumbnail__Description">{description}</p>
  </div>
);

export default Thumbnail;
