import React from "react";
import PropTypes from "prop-types";
import SpanWithIcon from "../../../molecules/SpanWithIcon";

function CompanyDetailsItem({
  icon,
  text,
  className,
  iconSize,
  iconClass,
  viewBox,
  name
}) {
  return (
    <p className={`CompanyDetails__item ${className}`} name={name}>
      {icon ? (
        <SpanWithIcon
          iconClass={`font-small CompanyDetails__icon ${iconClass}`}
          icon={icon}
          iconSize={iconSize}
          text={text}
          viewBox={viewBox}
        />
      ) : (
        text
      )}
    </p>
  );
}

CompanyDetailsItem.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  customClass: PropTypes.string
};
export default CompanyDetailsItem;
