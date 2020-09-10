import React, { Component } from "react";

import BaseInput from "../../../ui-components/BaseInput";
import SuggestorModalWithFreeInput from "../../organisms/SuggestorModalWithFreeInput";

import "./ClosedInputField.scss";

class ClosedInputField extends Component {
  state = {
    isSuggestorOpen: false
  };

  openSuggestorModal = e => {
    const { target } = e;
    this.setState({ isSuggestorOpen: true }, () => {
      target.blur();
    });
  };

  closeSuggestorModal = () => {
    this.setState({ isSuggestorOpen: false });
  };

  handleOptionSelection = selectedOptionObj => {
    this.props.input.onChange(selectedOptionObj);
  };

  preventEnterValue = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  render() {
    const {
      input,
      placeholder,
      classNames,
      dataUrl,
      data,
      _normalize,
      fieldLabel,
      separateOptionsThreshold,
      separateOptionsLabel
    } = this.props;
    const { value, name } = input;
    const { isSuggestorOpen } = this.state;
    return (
      <div className="ClosedInputField marginBottom_20">
        <BaseInput
          value={value && value.name}
          label={placeholder}
          className={classNames}
          onFocus={this.openSuggestorModal}
          onKeyDown={this.preventEnterValue}
        />
        {isSuggestorOpen && (
          <SuggestorModalWithFreeInput
            open={isSuggestorOpen}
            close={this.closeSuggestorModal}
            data={data}
            dataUrl={dataUrl}
            onOptionSelected={this.handleOptionSelection}
            title={`Select ${fieldLabel}`}
            normalize={_normalize}
            fieldLabel={fieldLabel}
            fieldName={name}
            renderOtherOption
            separateOptionsThreshold={separateOptionsThreshold}
            separateOptionsLabel={separateOptionsLabel}
          />
        )}
      </div>
    );
  }
}

export default ClosedInputField;
