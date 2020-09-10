import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { CSSTransition } from "react-transition-group";

import Overlay from "../Overlay/Overlay";
import ClickOutside from "../ClickOutside";

import "./Modal.scss";

const onClick = e => e.stopPropagation();
const Modal = props => {
  const {
    open,
    onClose,
    backdrop,
    children,
    closeOnClickOutside,
    className,
    animate,
    appear
  } = props;
  const setChildProps = {
    isModalOpen: open,
    closeModal: onClose
  };

  const renderChildWithProps = () => {
    if (!children || Array.isArray(children) || typeof children === "string") {
      return children;
    }

    if (typeof children === "function") {
      return children(setChildProps);
    }

    return React.cloneElement(children, setChildProps);
  };

  const withClickOutside = backdrop ? (
    <ClickOutside disable={!closeOnClickOutside} handleClickOutside={onClose}>
      {renderChildWithProps()}
    </ClickOutside>
  ) : (
    renderChildWithProps()
  );

  const modalContent = (
    <div
      onClick={onClick}
      className={cx([
        { visible: open, hidden: !open, noBackdrop: !backdrop },
        "modal",
        className
      ])}
    >
      {withClickOutside}
    </div>
  );

  const modalContentWrapper = animate ? (
    <CSSTransition
      appear={appear}
      in={open}
      timeout={300}
      classNames="slideFromBottom"
      unmountOnExit
    >
      {modalContent}
    </CSSTransition>
  ) : (
    modalContent
  );

  return backdrop ? (
    <>
      {modalContentWrapper}
      <Overlay open={open && backdrop} />
    </>
  ) : (
    modalContentWrapper
  );
};

Modal.propTypes = {
  children: PropTypes.any.isRequired,
  open: PropTypes.bool,
  closeOnClickOutside: PropTypes.bool,
  onClose: PropTypes.func,
  backdrop: PropTypes.bool,
  animate: PropTypes.bool,
  appear: PropTypes.bool
};

Modal.defaultProps = {
  open: undefined,
  closeOnClickOutside: false,
  onClose: () => {},
  backdrop: true,
  animate: true,
  appear: false
};

export default Modal;
