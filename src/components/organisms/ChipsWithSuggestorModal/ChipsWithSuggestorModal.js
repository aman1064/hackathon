import React, { Component } from "react";

import ChipGroup from "../../molecules/ChipGroup";
import Button from "../../atoms/Button";
import SuggestorModalWithFreeInput from "../../organisms/SuggestorModalWithFreeInput";
import Chip from "../../../ui-components/Chip";
import Loading from "../../atoms/Loading";

import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";
import { sortByKey } from "../../../utils/pureFns";
import getProfileCreationFlow from "../../../utils/getProfileCreationFlow";
import getGALabelFromFormFieldName from "../../../utils/getGALabelFromFormFieldName";

import tracker from "../../../analytics/tracker";

class ChipsWithSuggestorModal extends Component {
  state = {
    threshold: 2,
    chipList: [],
    allChips: [],
    showSearchBarModal: false,
    selectedChipObj: null
  };

  handleMoreButtonClick = () => {
    const { fieldLabel = "", trackGAEventOnOpen } = this.props;
    const gaAction = `more_${fieldLabel.toLowerCase()}_clicked`;
    const hitName =
      trackGAEventOnOpen || `${this.gaCategory}$${gaAction}$${this.gaLabel}`;
    tracker().on("event", {
      hitName
    });
    this.setState({
      showSearchBarModal: true
    });
  };

  handleCloseModal = () => {
    tracker().on("event", {
      hitName: this.props.trackGAEventOnClose
    });
    this.setState({
      showSearchBarModal: false
    });
  };
  handleChipList = selectedChipObj => {
    const { chipList, allChips } = this.state;
    const allChipList = [...allChips];
    selectedChipObj.length &&
      selectedChipObj.forEach(selectedChip => {
        const selectedIndex = chipList.findIndex(row => {
          return row.name === selectedChip.name;
        });
        const allSelectedIndex = allChipList.findIndex(row => {
          return row.name === selectedChip.name;
        });

        if (selectedIndex > -1) {
          chipList.splice(selectedIndex, 1);
        }
        allChipList.splice(allSelectedIndex, 1);
      });
    if (selectedChipObj.length >= this.props.threshold) {
      this.setState({ selectedChipObj, chipList: [] });
    } else if (
      selectedChipObj.length + chipList.length >
      this.props.threshold
    ) {
      const extraChips = this.props.threshold - selectedChipObj.length;
      chipList.splice(extraChips);

      this.setState({ selectedChipObj, chipList });
    } else if (selectedChipObj.length < this.props.threshold) {
      const extraChips = this.props.threshold - selectedChipObj.length;
      const newChipList = allChipList.splice(0, extraChips);
      this.setState({ selectedChipObj, chipList: newChipList });
    } else {
      this.setState({ selectedChipObj, chipList });
    }
  };

  handleChipSelection = selectedChipObj => {
    this.props.input.onChange(selectedChipObj);

    this.handleChipList(selectedChipObj);
  };

  handleSelectedChipDelete = () => {
    this.props.input.onChange("");
    if (typeof this.props.onChipDelete === "function") {
      this.props.onChipDelete();
    }
    this.setState({ selectedChipObj: null });
  };

  checkForPreselect = () => {
    const { value } = this.props.input;
    const { allChips } = this.state;
    if (value) {
      const selectedChipObjArr =
        allChips && allChips.filter(el => el.id === value.id);
      if (selectedChipObjArr.length) {
        this.setState({ selectedChipObj: selectedChipObjArr[0] });
      } else {
        this.handleChipList(value);
        //this.setState({ selectedChipObj: value });
      }
    }
  };
  getChipList() {
    const threshold = this.props.threshold || this.state.threshold;
    services.get(getUrl(this.props.chipListUrl)).then(res => {
      let sortedChips = res.data;
      if (res.data) {
        sortedChips = sortByKey(res.data, "name");
      }
      this.setState(
        {
          allChips: res.data,
          chipList: res.data && res.data.slice(0, threshold),
          sortedChips
        },
        this.checkForPreselect
      );
    });
  }

  componentDidMount() {
    this.getChipList();
    const { input: { name } } = this.props;
    this.gaCategory = getProfileCreationFlow();
    this.gaLabel = getGALabelFromFormFieldName(name);
  }
  componentDidUpdate(nextProps) {
    if (nextProps.chipListUrl !== this.props.chipListUrl) {
      this.getChipList();
    }
  }

  render() {
    const {
      showSearchBarModal,
      allChips,
      selectedChipObj,
      chipList,
      sortedChips
    } = this.state;
    const {
      input,
      modalPlaceholder,
      modalTitle,
      labelClassName,
      fieldLabel,
      renderOtherOption,
      _normalize,
      buttonSuffix = "",
      buttonText,
      isMultiSelect,
      meta
    } = this.props;
    const { name } = input;
    const threshold = this.props.threshold || this.state.threshold;
    const hiddenChipsNumber = allChips.length - threshold;
    let buttonLabel = "more";
    if (buttonSuffix) {
      buttonLabel = buttonSuffix.toLowerCase();
      if (hiddenChipsNumber > 1) {
        buttonLabel += "s";
      }
    }
    buttonLabel = buttonText
      ? buttonText
      : `+${hiddenChipsNumber} ${buttonLabel}`;
    return (
      <div className={`CWSM ${this.props.wrapperClass}`}>
        {selectedChipObj && !Array.isArray(selectedChipObj) ? (
          <Chip
            className="chipItem"
            label={selectedChipObj.name}
            appearance="secondary"
            onIconClick={this.handleSelectedChipDelete}
            labelClassName={labelClassName}
          />
        ) : (
          <div>
            {(chipList && chipList.length) ||
            (selectedChipObj && selectedChipObj.length) ? (
              <React.Fragment>
                <ChipGroup
                  {...this.props}
                  chipList={
                    selectedChipObj ? (
                      [...selectedChipObj, ...chipList]
                    ) : (
                      chipList
                    )
                  }
                  chipListUrl={undefined}
                  onChipChange={this.handleChipSelection}
                  chipGroupClass="chipsWithSuggestorWrapper"
                  labelClassName={labelClassName}
                />
                {allChips &&
                hiddenChipsNumber > 0 && (
                  <Button
                    type="link hasHover"
                    className="moreChipsButton"
                    onClick={this.handleMoreButtonClick}
                  >
                    {buttonLabel}
                  </Button>
                )}
                
              </React.Fragment>
            ) : (
              <Loading variant="isSmall" />
            )}
          </div>
        )}
         {meta && meta.error && <p className="formError inline_error">{meta.error}</p>}
        {showSearchBarModal && (
          <SuggestorModalWithFreeInput
            open={showSearchBarModal}
            close={this.handleCloseModal}
            data={sortedChips}
            onOptionSelected={this.handleChipSelection}
            title={modalTitle}
            placeholder={modalPlaceholder}
            fieldLabel={fieldLabel}
            fieldName={name}
            normalize={_normalize}
            renderOtherOption={renderOtherOption}
            isMulti={isMultiSelect}
            {...this.props}
            isOnChangeSuggestor={true}
          />
        )}
      </div>
    );
  }
}

export default ChipsWithSuggestorModal;
