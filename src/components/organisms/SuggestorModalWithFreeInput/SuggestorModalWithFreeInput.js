import React, { Component } from "react";

import SearchBarModal from "../../templates/SearchBarModal";
import FreeInputModal from "../../organisms/FreeInputModal";

class SuggestorModalWithFreeInput extends Component {
  state = {
    isSearchBarOpen: true,
    isFillOtherFieldOpen: false
  };

  handleOtherOptionClick = () => {
    this.setState({ isSearchBarOpen: false, isFillOtherFieldOpen: true });
  };

  closeFreeInputModal = () => {
    const { close } = this.props;
    this.setState({ isFillOtherFieldOpen: false });
    close();
  };

  render() {
    const {
      open,
      close,
      data,
      dataUrl,
      onOptionSelected,
      title,
      renderOtherOption,
      fieldLabel = "",
      normalize,
      placeholder,
      fieldName,
      separateOptionsThreshold,
      separateOptionsLabel,
      isMulti
    } = this.props;
    const { isSearchBarOpen, isFillOtherFieldOpen } = this.state;
    return (
      <div className="SMWFI">
        {isSearchBarOpen && (
          <SearchBarModal
            open={open && isSearchBarOpen}
            closeModal={close}
            data={data}
            dataUrl={dataUrl}
            title={title}
            placeholder={placeholder || `Search ${fieldLabel.toLowerCase()}`}
            onSelect={onOptionSelected}
            renderOtherOption={renderOtherOption}
            onOtherClick={this.handleOtherOptionClick}
            fieldLabel={fieldLabel}
            fieldName={fieldName}
            normalize={normalize}
            isMulti={isMulti}
            separateOptionsThreshold={separateOptionsThreshold}
            separateOptionsLabel={separateOptionsLabel}
            {...this.props.input}
          />
        )}
        {isFillOtherFieldOpen && (
          <FreeInputModal
            open={isFillOtherFieldOpen}
            close={this.closeFreeInputModal}
            title={`Tell us your ${fieldLabel.toLowerCase()}`}
            fieldLabel={fieldLabel}
            fieldName={fieldName}
            onSubmit={onOptionSelected}
            normalize={normalize}
          />
        )}
      </div>
    );
  }
}

export default SuggestorModalWithFreeInput;
