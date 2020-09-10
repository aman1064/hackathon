import React, { Component } from "react";

import Modal from "../../../ui-components/Modal";
import Title from "../../../ui-components/Modal/Title";
import PageHeading from "../../atoms/PageHeading";
import RadioGroup from "../../molecules/RadioGroup";
import "./RGModal.scss";
const RadioGroupModal = ({
  config,
  isCancleButton,
  title,
  closeModal,
  open,
  handleRadioChange
}) => (
  <div>
    <Modal
      open={open}
      onClose={closeModal}
      className={"bottomFixedModal"}
      closeOnClickOutside={true}
    >
      <Title handleClose={isCancleButton ? closeModal : ""}>
        <PageHeading title={title} className="modalHeading" />
      </Title>
      <div className="modalContent">
        <RadioGroup handleRadioChange={handleRadioChange} {...config} />
      </div>
    </Modal>
  </div>
);

export default RadioGroupModal;
