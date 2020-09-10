import React from "react";
import PropTypes from "prop-types";

import Modal from "../../../../../ui-components/Modal";
import { ModalCrossIcon } from "../../../../atoms/Icon";
import "./readMoreModal.scss";

const ReadMoreModal = props => {
  const { msg, initials, color, name, designation } = props.meta || {};

  return (
    <Modal
      open={props.open}
      className="read-more-modal"
      onClose={props.onClose}
      closeOnClickOutside
    >
      <div className="read-more-content">
        <div className="profile">
          <span className="initials" style={{ color }}>
            {initials}
          </span>
          <span className="name">{name}</span>
          <span className="designation">{designation}</span>
        </div>
        <p className="msg">&quot;{msg}&quot;</p>
      </div>
      <div className="actions">
        <button type="button" className="CVBar_close" onClick={props.onClose}>
          <ModalCrossIcon size={14} />
        </button>
      </div>
    </Modal>
  );
};

ReadMoreModal.propTypes = {
  meta: PropTypes.object,
  open: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

ReadMoreModal.defaultProps = {
  meta: {}
};

export default ReadMoreModal;
