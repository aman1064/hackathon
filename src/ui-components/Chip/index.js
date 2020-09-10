import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import "./index.scss";
import { TagCrossIcon } from "../../components/atoms/Icon";

const Chip = ({
  Icon,
  size,
  label,
  onClick,
  appearance,
  onIconClick,
  showSeparator,
  labelClassName,
  containerClassName,
  iconClassName,
  outlineClassName
}) => {
  const onChipClick = e => {
    e.stopPropagation();
    if (onClick) onClick(label, e);
    if (onIconClick) onIconClick(label, e);
  };

  const onIconClickHandler = e => {
    e.stopPropagation();
    if (onIconClick) onIconClick(label, e);
  };

  return (
    <div
      className={cx(["chip", containerClassName, appearance, size])}
      onClick={onChipClick}
    >
      <span className={cx(["label", labelClassName])}>{label}</span>
      {showSeparator && <span className={cx(["outline", outlineClassName])} />}
      {onIconClick && Icon && (
        <span
          className={`${iconClassName} icon chipLabel`}
          onClick={onIconClickHandler}
        >
          {Icon}
        </span>
      )}
      {onIconClick && !Icon && (
        <span className={cx([iconClassName])} onClick={onIconClickHandler}>
          <TagCrossIcon />
        </span>
      )}
    </div>
  );
};

Chip.propTypes = {
  Icon: PropTypes.node,
  size: PropTypes.oneOf(["large", "medium", "small"]),
  appearance: PropTypes.oneOf(["primary", "secondary"]),
  showSeparator: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onIconClick: PropTypes.func,
  labelClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  outlineClassName: PropTypes.string,
  iconClassName: PropTypes.string,
  onClick: PropTypes.func
};

Chip.defaultProps = {
  Icon: null,
  size: "medium",
  appearance: "primary",
  showSeparator: false,
  onClick: undefined,
  onIconClick: undefined,
  labelClassName: "",
  containerClassName: "",
  iconClassName: "",
  outlineClassName: ""
};

export default Chip;
