import React, { Component } from "react";
import PropTypes from "prop-types";

import ClickOutside from "../ClickOutside";

import { DropdownBlueIcon } from "../../components/atoms/Icon/icons";

import "./Menu.scss";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isAsync) {
      return {
        selectedIndex: nextProps.selectedIndex,
        selectedValue: nextProps.list[nextProps.selectedIndex]
      };
    }
    return !prevState.selectedValue && nextProps.selectedIndex !== "undefined"
      ? {
          selectedIndex: nextProps.selectedIndex,
          selectedValue: nextProps.list[nextProps.selectedIndex]
        }
      : null;
  }

  _getValue = (item, key) => {
    if (typeof item === "object" && item !== undefined) {
      return item[key];
    }
    return item;
  };

  toggle = () => {
    this.setState(state => {
      return { isMenuOpen: !state.isMenuOpen };
    });
  };

  handleClick = e => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    this.toggle();
  };

  handleMenuItemClick = selectedIndex => () => {
    const { list, valueKey } = this.props;
    const selectedValue = this._getValue(list[selectedIndex], valueKey);
    if (this.props.variant === "selected" && !this.props.isAsync) {
      this.setSelectedState(selectedIndex, selectedValue);
    }
    this.toggle();
    if (typeof this.props.onChange === "function") {
      this.props.onChange({ selectedValue, selectedIndex });
    }
  };

  setSelectedState = (selectedIndex, selectedValue) => {
    this.setState({
      selectedIndex,
      selectedValue
    });
  };

  render() {
    const { isMenuOpen, selectedIndex, selectedValue } = this.state;
    const {
      list,
      variant,
      className = "",
      id,
      labelKey,
      labelSuffix
    } = this.props;
    return (
      <div
        className={`Menu ${isMenuOpen ? "isExpanded" : ""} ${className}`}
        id={id}
      >
        {variant === "selected" ? (
          <button
            className="Menu__Trigger"
            type="button"
            onClick={this.handleClick}
          >
            {this._getValue(list[selectedIndex], labelKey)} {labelSuffix}{" "}
            <DropdownBlueIcon size={12} />
          </button>
        ) : (
          <span
            aria-label="More"
            aria-controls="long-menu"
            aria-haspopup="true"
            className="Menu__Trigger"
            id="More_icon"
            onClick={this.handleClick}
          >
            <DropdownBlueIcon size={12} />
          </span>
        )}

        {isMenuOpen && (
          <ClickOutside handleClickOutside={this.handleClick}>
            <ul className="Menu__List">
              {list.map((item, index) => (
                <li
                  id={`${item}`}
                  onClick={this.handleMenuItemClick(index)}
                  className={`Menu__Item ${
                    index === selectedIndex ? "isSelected" : ""
                  }`}
                >
                  {this._getValue(item, labelKey)}
                </li>
              ))}
            </ul>
          </ClickOutside>
        )}
      </div>
    );
  }
}

Menu.propTypes = {
  list: PropTypes.array.isRequired,
  variant: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  onChange: PropTypes.func,
  selectedIndex: PropTypes.number,
  isAsync: PropTypes.bool,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  labelSuffix: PropTypes.string
};

Menu.defaultProps = {
  variant: "",
  className: "",
  id: "",
  onChange: () => {},
  isAsync: false,
  labelKey: "label",
  valueKey: "value",
  selectedIndex: 0,
  labelSuffix: ""
};

export default Menu;
