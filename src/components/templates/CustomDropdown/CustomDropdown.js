import React, { Component } from "react";
import "./CustomDropdown.scss";
import services from "../../../utils/services";
import { getUrl } from "../../../utils/getUrl";

import { DropdownIcon } from "../../atoms/Icon/icons";

class CustomDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsData: [],
      selectedValue: "",
      showList: false,
      bottomSpace: ""
    };
  }
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.selectedValue) {
      return {
        selectedValue: nextProps.selectedValue ? nextProps.selectedValue : ""
      };
    } else {
      return {
        selectedValue: ""
      };
    }
  }
  componentDidMount() {
    const { data } = this.props;
    let { dataUrl } = this.props;
    if (dataUrl) {
      dataUrl = getUrl(dataUrl);
      services.get(dataUrl).then(res => {
        this.setState({ optionsData: res.data });
      });
    } else {
      this.setState({ optionsData: data || [] });
    }
  }

  closeList = () => {
    this.setState({ showList: false });
  };
  getList = options => {
    return options.map((option, i) => (
      <li
        key={i}
        className="list_item"
        data-name={option.name}
        data-value={option.value}
        onClick={this.handleOnClick}
      >
        {option.name}
      </li>
    ));
  };
  handleOnClick = e => {
    const selectedData = {
      name: e.target.dataset.name,
      value: e.target.dataset.value
    };
    this.setState({ selectedValue: selectedData.name });
    this.props.onSelect && this.props.onSelect(selectedData, this.props.index);
    this.closeList();
  };
  handleDropdownClick = event => {
    event.preventDefault();
    this.setState({
      showList: !this.state.showList,
      bottomSpace: document.documentElement.offsetHeight - event.pageY
    });
  };

  render() {
    const { width, height, title, subTitle, disabled } = this.props,
      { optionsData, selectedValue, showList, bottomSpace } = this.state;
    const label = selectedValue ? `${selectedValue}${subTitle}` : title;
    return (
      <div
        className={`customDropdown ${showList ? "isExpanded" : ""} ${
          disabled ? "pointerEvents_none" : ""
        }`}
        onClick={this.handleDropdownClick}
      >
        <button className={`dropdownButton ${width}`} disabled={disabled}>
          <span className="expLabelClass">{label}</span>
          <DropdownIcon size={10} />
        </button>
        {showList && (
          <ul
            className={`${
              bottomSpace > 300 ? "selector_list" : "selector_list_upper"
            } ${width} ${height}`}
          >
            {this.getList(optionsData)}
          </ul>
        )}
      </div>
    );
  }
}

export default CustomDropdown;
