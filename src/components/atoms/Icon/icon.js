/**
 * @name Icon
 * @category Components
 * @tags Ring UI Language
 * @constructor
 * @description Displays an icon.
 * @extends {ReactComponent}
 * @example-file ./icon.examples.html
 */

// eslint-disable-next-line max-classes-per-file
import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Color, Size } from "./icon__constants";
import "./Icon.scss";

export default class Icon extends PureComponent {
  render() {
    const {
      className,
      size,
      color,
      loading,
      glyph,
      width,
      height,
      paddingTop,
      ...restProps
    } = this.props;

    const classes = ["icon", className].filter(Boolean).join(" ");

    const style =
      width || height
        ? {
            width,
            height
          }
        : {
            width: size,
            height: size
          };
    if (paddingTop) {
      style.paddingTop = paddingTop;
    }

    return (
      <span {...restProps} className={classes}>
        <img alt="" className="davidIcon" src={glyph} style={style} />{" "}
      </span>
    );
  }
}

Icon.Color = Color;

Icon.Size = Size;

Icon.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  paddingTop: PropTypes.string,
  height: PropTypes.number,
  size: PropTypes.number,
  width: PropTypes.number,
  loading: PropTypes.bool
};

Icon.defaultProps = {
  className: "",
  color: Color.DEFAULT,
  glyph: "",
  size: Size.Size18,
  paddingTop: "",
  height: 0,
  width: 0,
  loading: false
};

export { Size };

/** =========================HOC============================== */

export function iconHOC(glyph, displayName) {
  // eslint-disable-next-line react/no-multi-comp
  class BoundIcon extends PureComponent {
    static toString() {
      return glyph;
    }

    render() {
      const { iconRef, ...restProps } = this.props;
      return <Icon ref={iconRef} {...restProps} glyph={glyph} />;
    }
  }

  BoundIcon.Color = Color;

  BoundIcon.Size = Size;

  BoundIcon.displayName = displayName;

  BoundIcon.propTypes = {
    iconRef: PropTypes.func
  };

  BoundIcon.defaultProps = {
    iconRef: () => {}
  };

  return BoundIcon;
}
