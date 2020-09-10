import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";

import "./Overlay.scss";

class Overlay extends PureComponent {
  constructor(props) {
    super(props);

    this.html = document.querySelector("html");
    this.body = document.querySelector("body");
  }

  componentDidMount() {
    if (this.props.open) {
      this.disableScroll();
    }
  }

  componentDidUpdate(prevProps) {
    const { open: isOpenBefore } = prevProps;
    const { open: isOpenNow } = this.props;

    if (isOpenBefore && !isOpenNow) this.enableScroll();
    if (!isOpenBefore && isOpenNow) this.disableScroll();
  }

  componentWillUnmount() {
    this.enableScroll();
  }

  disableScroll = () => {
    this.html.classList.add("noScroll");
    this.body.classList.add("noScroll");
  };

  enableScroll = () => {
    this.html.classList.remove("noScroll");
    this.body.classList.remove("noScroll");
  };
  handleClick = (e) => {
    e.stopPropagation();
  }

  render() {
    const { children, open } = this.props;
    const className = cx("overlay", "fade-anim", {
      "fade-in": !open
    });

    return (
      <CSSTransition in={open} timeout={300} classNames="overlay" unmountOnExit>
        <div className={className} onClick={this.handleClick}>{children}</div>
      </CSSTransition>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.oneOf([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node)
  ]),
  open: PropTypes.bool
};

Overlay.defaultProps = {
  children: null,
  open: false
};

export default Overlay;
