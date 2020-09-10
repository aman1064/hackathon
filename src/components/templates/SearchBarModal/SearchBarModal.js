import React, { Component } from "react";
import deburr from "lodash.deburr";
import debounce from "debounce";

import Title from "../../../ui-components/Modal/Title";
import Modal from "../../../ui-components/Modal";
import { getUrl } from "../../../utils/getUrl";
import { sortByKey } from "../../../utils/pureFns";
import services from "../../../utils/services";
import { SearchIcon, CrossIcon } from "../../atoms/Icon";
import BaseInput from "../../../ui-components/BaseInput";
import TextHighlighter from "../ReactSuggestor/TextHighlighter";
import Button from "../../atoms/Button";
import Loading from "../../atoms/Loading";
import FreeInputHint from "../../molecules/FreeInputHint";
import tracker from "../../../analytics/tracker";
import getProfileCreationFlow from "../../../utils/getProfileCreationFlow";
import getGALabelFromFormFieldName from "../../../utils/getGALabelFromFormFieldName";
import CheckboxGroup from "../../molecules/CheckboxGroup";

import "./SearchBarModal.scss";

class SearchBarModal extends Component {
  constructor(props) {
    super(props);
    const checkedState = {};
    props.value &&
      props.value.forEach(data => {
        checkedState[data.id] = true;
      });
    this.state = {
      optionsData: [],
      filterOptionsData: undefined,
      openModal: true,
      selectedData: props.value ? [...props.value] : [],
      stickModalToTop: false,
      typedValue: "",
      checkedState: checkedState
    };
  }

  componentDidMount() {
    const {
      data,
      fieldLabel = "",
      fieldName,
      separateOptionsThreshold
    } = this.props;
    if (data && data.length) {
      this.topOptions = sortByKey(data.slice(0, separateOptionsThreshold),"name");
      this.completeData = sortByKey(data, "name");
      this.setState({
        optionsData: this.completeData,
        filterOptionsData: this.completeData
      });
    } else {
      this.getAPIData();
    }

    this.gaCategory = getProfileCreationFlow();
    this.gaAction = `select_${fieldLabel.toLowerCase()}_crossed`;
    this.gaLabel = getGALabelFromFormFieldName(fieldName);
  }

  getAPIData = (inputValue = "") => {
    let { dataUrl } = this.props;
    const { separateOptionsThreshold } = this.props;

    dataUrl = getUrl(dataUrl).replace("{input}", inputValue);
    services.get(dataUrl).then(res => {
      if (separateOptionsThreshold) {
        this.topOptions = sortByKey(
          res.data.slice(0, separateOptionsThreshold),
          "name"
        );
      }

      this.completeData = sortByKey(res.data, "name");
      this.setState({
        optionsData: this.completeData,
        filterOptionsData: this.completeData,
        typedValue: inputValue
      });
    });
  };
  handleCheckboxOnChange = (checkboxKey, label, checked) => () => {
    const { selectedData } = this.state;
    if (!checked) {
      selectedData.push({
        id: checkboxKey,
        name: label,
        hasApiMatch: true
      });
    } else if (selectedData.length) {
      const index = selectedData.findIndex(item => item.name === label);
      selectedData.splice(index, 1);
    }

    this.setState({
      selectedData,
      checkedState: {
        ...this.state.checkedState,
        [checkboxKey]: !this.state.checkedState[checkboxKey]
      }
    });
  };

  getTopList = () => {
    const {
      separateOptionsThreshold,
      separateOptionsLabel,
      isMulti
    } = this.props;
    const topList = [];
    topList.push(<div className="list_label">Top {separateOptionsLabel}</div>);
    if (isMulti) {
      topList.push(
        <div className={"CheckboxGroup"}>
          <CheckboxGroup
            checkboxData={this.topOptions}
            onChange={this.handleCheckboxOnChange}
            checkedState={this.state.checkedState}
            labelPlacement="start"
            className="CheckboxGroup"
            uncheckedIconClassName="unCheckedIcon"
            checkedIconClassName="checkedIcon"
          />
        </div>
      );
    } else {
      for (let i = 0; i < separateOptionsThreshold; i++) {
        topList.push(
          <div
            className="list_item"
            onClick={this.handleOnClick}
            data-name={this.topOptions[i].name}
            data-id={this.topOptions[i].id}
          >
            {this.topOptions[i].name}
          </div>
        );
      }
    }

    topList.push(
      <div className="list_label lineBefore">All {separateOptionsLabel}</div>
    );
    return topList;
  };

  getList = options => {
    const {
      isMulti,
      renderOtherOption,
      fieldLabel = "",
      onOtherClick,
      separateOptionsThreshold
    } = this.props;

    // const selectedData = this.state.selectedData ;
    // const optionsData = [...selectedData];
    const handleOnClick = this.handleOnClick;
    const that = this;
    const { typedValue = "" } = this.state;
    let allOptions = [];

    if (separateOptionsThreshold && !typedValue) {
      allOptions = this.getTopList();
    }

    const optionsList = isMulti ? (
      <div className={"CheckboxGroup"}>
        <CheckboxGroup
          checkboxData={options}
          onChange={this.handleCheckboxOnChange}
          checkedState={this.state.checkedState}
          labelPlacement="start"
          className="CheckboxGroup"
          uncheckedIconClassName="unCheckedIcon"
          checkedIconClassName="checkedIcon"
        />
      </div>
    ) : (
      options.map((option, i) => (
        <li
          key={i}
          className="list_item"
          data-name={option.name}
          data-id={option.id}
          onClick={handleOnClick.bind(that)}
        >
          <TextHighlighter search={typedValue.trim()}>
            {option.name}
          </TextHighlighter>
        </li>
      ))
    );

    if (renderOtherOption && !typedValue) {
      optionsList.push(
        <li
          className="list_item otherOption"
          onClick={onOtherClick}
          key="other"
        >
          Not finding your {fieldLabel.toLowerCase()}?
        </li>
      );
    }

    return allOptions.concat(optionsList);
  };

  handleSelectClick = e => {
    this.props.onSelect && this.props.onSelect(this.state.selectedData);
    this.props.closeModal();
  };

  handleOnClick = e => {
    this.props.onSelect &&
      this.props.onSelect({
        name: e.target.dataset.name.trim(),
        id: e.target.dataset.id
      });
    this.props.closeModal();
  };
  getFilterOptionsData = value => {
    const { optionsData } = this.state;
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? optionsData
      : optionsData.filter(option =>
          option.name.toLowerCase().includes(inputValue)
        );
  };

  handleSearchBarChange = event => {
    let inputValue = event.target.value;
    const { isOnChangeSuggestor, normalize } = this.props;
    const { typedValue: preValue } = this.state;
    if (normalize) {
      inputValue = normalize(inputValue, preValue);
    }
    this.setState({
      isInputEmpty: false
    });
    if (isOnChangeSuggestor) {
      this.getAPIData(inputValue);
    } else {
      this.setState({ typedValue: inputValue });
      this.debouncedSetFilterData(inputValue);
    }
  };

  debouncedSetFilterData = debounce(inputValue => {
    this.setState({
      filterOptionsData: this.getFilterOptionsData(inputValue)
    });
  }, 300);

  stickModalToTop = () => {
    this.setState({ stickModalToTop: true });
  };

  getFreeTextElements = () => {
    const { renderOtherOption, fieldLabel = "" } = this.props;
    const { filterOptionsData, typedValue } = this.state;
    const extraElements = [];
    if (renderOtherOption) {
      if (!filterOptionsData.length) {
        extraElements.push(
          <FreeInputHint key="1" fieldLabel={fieldLabel.toLowerCase()} />
        );
      }

      if (typedValue) {
        extraElements.push(
          <div
            key="2"
            className="js_submit_button_wrapper spreadHr textCenter fixedToBottom freeInputCTA"
          >
            {/* empty div is used to align button to the right */}
            <div />
            <Button
              type="link hasHover"
              buttonType="button"
              color="primary"
              id="formNextButton"
              onClick={this.handleOnClick}
              data-name={typedValue}
              data-id=""
            >
              <span className="nav_arrow tick secondary pointerEvents_none" />
            </Button>
          </div>
        );
      }
    }

    return extraElements;
  };

  preventEnter = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  _closeModal = () => {
    const { closeModal } = this.props;
    tracker().on("event", {
      hitName: `${this.gaCategory}$${this.gaAction}$${this.gaLabel}`
    });
    closeModal();
  };
  handleClear = () => {
    this.setState({
      selectedData: [],
      checkedState: {}
    });
  };
  onRightIconClick = () => {
    if (this.state.typedValue) {
      this.setState({
        typedValue: "",
        filterOptionsData: this.props.data
      });
    }
  };

  render() {
    const {
        title,
        placeholder,
        backdrop,
        open,
        renderOtherOption,
        isMulti
      } = this.props,
      { filterOptionsData, stickModalToTop, typedValue } = this.state;
    const that = this;

    return (
      <div>
        <Modal
          open={open}
          onClose={this._closeModal}
          closeOnClickOutside={false}
          backdrop={backdrop}
          className={`searchBarModal ${
            stickModalToTop ? "isAtTop" : ""
          } ${isMulti && " isEdit"}`}
          appear
        >
          <Title handleClose={!isMulti && this._closeModal}>
            <p>
              {title}
              {isMulti && !typedValue && (
                <Button
                  buttonType="button"
                  type="link hasHover"
                  className="modalCross"
                  onClick={this.handleClear}
                >
                  Clear
                </Button>
              )}
            </p>
            <BaseInput
              value={typedValue}
              placeholder={placeholder}
              containerClassName="searchBar blue_grey_Input blue_grey_InputBorder"
              onChange={this.handleSearchBarChange}
              onFocus={stickModalToTop ? undefined : this.stickModalToTop}
              rightIconNode={
                !isMulti ? (
                  <SearchIcon />
                ) : !typedValue ? (
                  <SearchIcon />
                ) : (
                  <CrossIcon />
                )
              }
              onKeyDown={this.preventEnter}
              onRightIconClick={isMulti && this.onRightIconClick.bind(this)}
            />
          </Title>
          <div
            className={`searchBarModalContent ${
              typedValue && renderOtherOption ? "hasBottomBtn" : ""
            }`}
            onScroll={stickModalToTop ? undefined : this.stickModalToTop}
          >
            {filterOptionsData ? (
              <div>
                <ul className="selector_list" id="jobRoleOptions">
                  {that.getList(filterOptionsData)}
                </ul>
                {renderOtherOption && this.getFreeTextElements()}{" "}
              </div>
            ) : (
              <Loading />
            )}
          </div>
          {isMulti && (
            <div className="js_submit_button_wrapper textCenter fixedToBottom spreadHr isEdit">
              <Button type="link hasHover" onClick={this._closeModal}>
                <span className="nav_arrow prev">{""}</span>
              </Button>
              <Button
                type="link hasHover"
                onClick={this.handleSelectClick}
                id="formNextButton"
              >
                <span className={`nav_arrow secondary`}>{""}</span>
              </Button>
            </div>
          )}
        </Modal>
      </div>
    );
  }
}

export default SearchBarModal;
