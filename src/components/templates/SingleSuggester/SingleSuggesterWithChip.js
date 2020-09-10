import React, { Component, lazy, Suspense } from "react";
import debounce from "debounce";

import Chip from "../../../ui-components/Chip";
import ReactSuggestor from "../../templates/ReactSuggestor/ReactSuggestor";
import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";
import getRegexFuc from "../../../utils/getRegexFun";
import regexConfig from "../../../constants/regexConfig";

class SingleSuggesterWithChip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
      selectedItem: props.chipSelectedValue ? [props.chipSelectedValue] : [],
      suggestionsData: []
    };
    this.validateRegexFun = getRegexFuc(regexConfig.skillSuggester);
  }
  static getDerivedStateFromProps(nextProps) {
    return {
      selectedItem: nextProps.chipSelectedValue
        ? [nextProps.chipSelectedValue]
        : []
    };
  }

  handleKeyDown = () => event => {
    if (event.keyCode === 13) {
      event.preventDefault();
    }

    const { inputValue, selectedItem } = this.state;
    if (
      selectedItem.length &&
      !inputValue.length &&
      event.key === "Backspace"
    ) {
      this.props.onDelete(selectedItem[0]);
    }
  };
  getApiData = inputValue => {
    let { dataUrl } = this.props;
    dataUrl = getUrl(dataUrl.replace("{input}", inputValue));
    if (inputValue.length >= 1) {
      services.get(dataUrl).then(res => {
        const data = res.data && res.data.filter((val, index) => index < 10);
        this.setState({
          suggestionsData: data
        });
      });
    } else {
      this.setState({ suggestionsData: [] });
    }
  };

  getApiDataWithDebounce = debounce(inputValue => {
    this.getApiData(inputValue);
  }, 300);

  handleInputChange = (event, inputValue) => {
    if (this.state.selectedItem.length > 0) {
      inputValue = "";
    }
    if (
      (inputValue.length >= 50 || !this.validateRegexFun(inputValue)) &&
      inputValue
    ) {
      return;
    }
    if (inputValue.length < 3) {
      this.getApiData(inputValue);
    } else {
      this.getApiDataWithDebounce(inputValue);
    }
    this.setState({ inputValue: inputValue });
  };

  handleChange = id => item => {
    const data = this.state.suggestionsData;
    let { selectedItem } = this.state;
    if (selectedItem.indexOf(item) === -1) {
      selectedItem = [...selectedItem, item];
    }

    this.setState({
      inputValue: "",
      selectedItem
    });
    const selectedData = data.find(item => item.name === selectedItem[0].name);
    this.props.onSelect(selectedData, id);
  };

  handleDelete = item => {
    this.setState(state => {
      const selectedItem = [...state.selectedItem];
      selectedItem.splice(selectedItem.indexOf(item), 1);
      return { selectedItem };
    });
    this.props.onDelete(item);
  };

  handleOnBlur = id => () => {
    this.createChip(id);
    if (this.state.isInputFocused) {
      this.setState({ isInputFocused: false });
    }
  };

  createChip = id => {
    const { inputValue } = this.state;
    if (inputValue !== "") {
      this.setState({
        selectedItem: inputValue,
        inputValue: ""
      });
      const selectedData = {
        name: inputValue,
        id: ""
      };
      this.props.onSelect(selectedData, id);
    }
  };

  handleInputFocus = () => {
    this.setState({
      isInputFocused: true
    });
  };

  render() {
    const { placeholder, className, disabled, id, onSelect } = this.props,
      { inputValue, selectedItem, isInputFocused } = this.state,
      { classes } = this.props,
      suggestionsData = this.state.suggestionsData,
      selectedChip = selectedItem[0];
    return (
      <div className={className}>
        <Suspense fallback={<div>Loading</div>}>
          <ReactSuggestor
            inputProps={{
              inputWrapperClass: `${selectedChip ? "hasChip" : ""} ${
                isInputFocused ? "isFocused" : ""
              }`,
              placeholder: { placeholder },
              id: id,
              usePlaceholderPropsAsInputPlaceholder: true,
              onBlur: this.handleOnBlur(id),
              leftIconNode: selectedChip ? (
                <Chip
                  key={selectedChip}
                  tabIndex={-1}
                  label={selectedChip}
                  appearance="secondary"
                  id={`skillChip_${id}`}
                  onIconClick={this.handleDelete.bind(this, selectedChip)}
                />
              ) : (
                undefined
              )
            }}
            onKeyDown={this.handleKeyDown(id)}
            onFocus={selectedChip ? this.handleInputFocus : () => {}}
            onChange={this.handleInputChange}
            value={inputValue}
            fetchData={() => {}}
            dataItems={suggestionsData}
            onSelect={this.handleChange(id)}
            dataLimit={10}
          />
        </Suspense>
      </div>
    );
  }
}

export default SingleSuggesterWithChip;
