import React from "react";
import PropTypes from "prop-types";

import ModalTitle from "../../../../../../ui-components/Modal/Title";
import Button from "../../../../../atoms/Button";
import Modal from "../../../../../../ui-components/Modal";

const ExitModal = props => {
  const percentCovered =
    (props.questionsAttempted / props.totalQuestionsInQuiz) * 100;
  return (
    <Modal
      open={props.isConfirmModalOpen}
      className="Modal__Bottom"
      onClose={props.closeConfirmModal}
      closeOnClickOutside
    >
      <ModalTitle handleClose={props.closeConfirmModal}>
        Do you really want to end now?
      </ModalTitle>
      <div className="message">
        {percentCovered < 65
          ? "We might not be able to show you insights if you quit now. Do you really wish to end test?"
          : "You can score more by attempting remaining question(s). Do you really wish to end test?"}
      </div>
      <div className="actions">
        <Button appearance="secondary" onClick={props.confirmEnd}>
          End Test
        </Button>
        <Button onClick={props.closeConfirmModal}>Continue</Button>
      </div>
    </Modal>
  );
};

ExitModal.propTypes = {
  isConfirmModalOpen: PropTypes.bool,
  closeConfirmModal: PropTypes.func.isRequired,
  confirmEnd: PropTypes.func.isRequired,
  questionsAttempted: PropTypes.number.isRequired,
  totalQuestionsInQuiz: PropTypes.number.isRequired
};

ExitModal.defaultProps = {
  isConfirmModalOpen: false
};

export default ExitModal;
