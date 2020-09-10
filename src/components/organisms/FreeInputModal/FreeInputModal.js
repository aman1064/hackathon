import React, { Component } from "react";

import Modal from "../../../ui-components/Modal";
import Title from "../../../ui-components/Modal/Title";
import BaseInput from "../../../ui-components/BaseInput";
import Button from "../../atoms/Button";

import tracker from "../../../analytics/tracker";
import getProfileCreationFlow from "../../../utils/getProfileCreationFlow";
import getGALabelFromFormFieldName from "../../../utils/getGALabelFromFormFieldName";

class FreeInputModal extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: ""
    };
  }

  componentDidMount() {
    const { fieldName } = this.props;
    this.gaCategory = getProfileCreationFlow();
    this.gaLabel = getGALabelFromFormFieldName(fieldName);
  }

  handleFreeInputChange = e => {
    const { inputValue: preValue } = this.state;
    const { normalize } = this.props;
    let inputValue = e.target.value;
    if (normalize) {
      inputValue = normalize(inputValue, preValue);
    }
    this.setState({ inputValue });
  };

  handleFreeInputSubmit = () => {
    const { onSubmit, close, fieldLabel = "" } = this.props;
    const { inputValue = "" } = this.state;
    const gaAction = `tell_other_${fieldLabel.toLowerCase()}_submitted`;
    onSubmit({ name: inputValue.trim(), id: "" });
    tracker().on("event", {
      hitName: `${this.gaCategory}$${gaAction}$${this.gaLabel}`
    });
    close();
  };

  preventEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  _closeModal = () => {
    const { close, fieldLabel = "" } = this.props;
    const gaAction = `tell_other_${fieldLabel.toLowerCase()}_crossed`;
    tracker().on("event", {
      hitName: `${this.gaCategory}$${gaAction}$${this.gaLabel}`
    });
    close();
  };

  render() {
    const { open, title, normalize, fieldLabel = "" } = this.props;
    const { inputValue } = this.state;

    return (
      <Modal
        className="freeInputModal"
        open={open}
        onClose={this._closeModal}
        animate={false}
      >
        <Title handleClose={this._closeModal}>
          <p>{title}</p>
          <BaseInput
            autoFocus
            containerClassName="searchBar blue_grey_Input blue_grey_InputBorder"
            onChange={this.handleFreeInputChange}
            value={inputValue}
            onKeyDown={this.preventEnter}
            normalize={normalize}
            placeholder={`Type your ${fieldLabel.toLowerCase()}`}
          />
        </Title>
        <div className="js_submit_button_wrapper spreadHr textCenter fixedToBottom freeInputCTA">
          {/* empty div is used to align button to the right */}
          <div />
          <Button
            type="link hasHover"
            buttonType="button"
            color="primary"
            id="formNextButton"
            onClick={this.handleFreeInputSubmit}
            disabled={!inputValue}
          >
            <span className="nav_arrow tick secondary pointerEvents_none" />
          </Button>
        </div>
      </Modal>
    );
  }
}

export default FreeInputModal;
