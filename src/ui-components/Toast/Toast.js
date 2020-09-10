import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import CSSTransition from "react-transition-group/CSSTransition";
import DefaultToast from "./DefaultToast";
import ClickOutside from "../ClickOutside";

import "./Toast.scss";

class Toast extends PureComponent {
  constructor(props) {
    super(props);

    const isControlled = typeof this.props.isOpen !== "undefined";
    this.state = {
      isOpen: isControlled ? this.props.isOpen : !!this.props.message,
      isControlled
    };

    this.toastTimeoutId = null;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isOpen: prevState.isControlled ? nextProps.isOpen : !!nextProps.message
    };
  }

  componentDidMount() {
    if (this.state.isOpen) {
      this.setToastTimeout();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { message: currentMsg } = this.props;
    const { message: prevMsg } = prevProps;

    const isFreshMessage = !prevMsg && !!currentMsg;
    const isMessageChanged =
      !!prevMsg && !!currentMsg && prevMsg !== currentMsg;

    if (this.state.isOpen && (isFreshMessage || isMessageChanged)) {
      this.setToastTimeout();
    }

    // close timeout
    if (this.state.isControlled && prevState.isOpen && !this.state.isOpen) {
      this.clearToastTimeout();
      this.props.onClose();
    }
  }

  componentWillUnmount() {
    this.clearToastTimeout();
  }

  setToastTimeout = () => {
    this.clearToastTimeout();
    this.toastTimeoutId = setTimeout(
      this.closeToast,
      this.props.autoHideDuration
    );
  };

  clearToastTimeout = () => {
    if (this.toastTimeoutId) {
      clearTimeout(this.toastTimeoutId);
      this.toastTimeoutId = null;
    }
  };

  closeToast = () => {
    if (this.state.isOpen) {
      this.setState({ isOpen: false });
      this.clearToastTimeout();
      this.props.onClose();
    }
  };

  render() {
    const {
      variant,
      message,
      direction,
      actionIcon,
      RenderContent,
      actionClassName,
      messageClassName,
      containerClassName,
      renderContentProps,
      closeOnClickOutside
    } = this.props;

    const { isOpen } = this.state;
    return (
      <CSSTransition
        in={isOpen}
        timeout={250}
        classNames="toaster"
        unmountOnExit
      >
        <ClickOutside
          disable={!closeOnClickOutside}
          handleClickOutside={this.closeToast}
        >
          <div
            className={cx([
              "toast",
              containerClassName,
              direction,
              variant,
              { showMsg: isOpen, hideMsg: !isOpen }
            ])}
          >
            {RenderContent && (
              <RenderContent
                isOpen={isOpen}
                message={message}
                onClose={this.closeToast}
                actionClassName={actionClassName}
                messageClassName={messageClassName}
                actionIcon={actionIcon}
                renderContentProps={renderContentProps}
              />
            )}
          </div>
        </ClickOutside>
      </CSSTransition>
    );
  }
}

Toast.propTypes = {
  RenderContent: PropTypes.func,
  autoHideDuration: PropTypes.number,
  closeOnClickOutside: PropTypes.bool,
  containerClassName: PropTypes.string,
  messageClassName: PropTypes.string,
  actionClassName: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  isOpen: PropTypes.bool,
  message: PropTypes.string,
  actionIcon: PropTypes.node,
  variant: PropTypes.oneOf(["default", "success", "warning", "error"])
};

Toast.defaultProps = {
  RenderContent: DefaultToast,
  autoHideDuration: 4000,
  closeOnClickOutside: true,
  containerClassName: "",
  messageClassName: "",
  actionClassName: "",
  direction: "bottom",
  isOpen: undefined,
  message: "",
  actionIcon: null,
  variant: "default"
};

export default Toast;
