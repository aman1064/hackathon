import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import Button from "../../atoms/Button";

function TextCard({ config, children }) {
  const buttonConfig = {
    size: "small",
    className: "fontSize_13 flexShrink_0"
  };
  if (config.redirect) {
    buttonConfig.component = Link;
    buttonConfig.to = config.redirect;
  } else {
    buttonConfig.onClick = config.clickAction;
  }
  return (
    <div className={`flatCard margin_10 ${config.wrapperClass}`}>
      <h3 className={`fontSize_17 spreadHr ${config.customClass}`}>
        <span>{config.headerText}</span>
        {config.viewAll && (
          <Button {...buttonConfig}>View all ({config.count})</Button>
        )}
      </h3>
      {children}
      {config.footerText && (
        <p className="fontSize_13 marginTop_10">
          {config.footerText}
          <Button {...buttonConfig}>Ask a question</Button>
        </p>
      )}
    </div>
  );
}

TextCard.propTypes = {
  config: PropTypes.shape({
    headerText: PropTypes.string,
    footerText: PropTypes.string,
    viewAll: PropTypes.bool,
    clickAction: PropTypes.func,
    redirect: PropTypes.string,
    count: PropTypes.number
  }),
  children: PropTypes.node.isRequired
};
export default TextCard;
