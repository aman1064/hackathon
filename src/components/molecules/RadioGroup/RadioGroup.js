import React, { Component } from "react";

import Radio from "../../../ui-components/Radio";
import HelpText from "../../atoms/HelpText";
import Loading from "../../atoms/Loading";

import "./RadioGroup.scss";

class RadioGroup extends Component {
  state = {
    parsedRadioGroupData: null
  };

  static getDerivedStateFromProps = nextProps => {
    const addToNextState = {};
    if (nextProps.input && nextProps.input.value) {
      addToNextState.value = nextProps.input.value;
    }
    return addToNextState;
  };

  handleRadioChange = e => {
    this.props.handleRadioChange &&
      this.props.handleRadioChange(e.target.value);
    this.props.input && this.props.input.onChange(e.target.value);
    this.setState({
      value: e.target.value
    });
  };

  componentDidMount() {
    const isEdit =
      this.props.history &&
      this.props.history.location.state &&
      this.props.history.location.state.isEdit;
    const radioGroupData = this.props,
      { valueKey } = radioGroupData,
      setStateObj = {},
      parsedRadioGroupData = radioGroupData.radioList.reduce(
        (acc, radioGroupItem) => {
          if (radioGroupItem.type === "helpText") {
            acc.titleObj = radioGroupItem;
          } else if (radioGroupItem.type !== "heading") {
            acc.radioItemList.push(radioGroupItem);
            if (radioGroupItem.isDefault) {
              acc.defaultSelectedValue = radioGroupItem[valueKey];
            }
          }
          return acc;
        },
        {
          titleObj: null,
          radioItemList: [],
          defaultSelectedValue: null
        }
      );
    if (
      !this.state.value &&
      parsedRadioGroupData.defaultSelectedValue &&
      !isEdit
    ) {
      setStateObj.value = parsedRadioGroupData.defaultSelectedValue;
      this.props.handleRadioChange &&
        this.props.handleRadioChange(parsedRadioGroupData.defaultSelectedValue);
      this.props.input &&
        this.props.input.onChange(parsedRadioGroupData.defaultSelectedValue);
    }
    setStateObj.parsedRadioGroupData = parsedRadioGroupData;
    this.setState({ ...setStateObj });
  }
  render() {
    const radioGroupData = this.props;
    const { valueKey, labelKey , initialValue,meta } = this.props;
    return this.state.parsedRadioGroupData ? (
      <fieldset className={`${radioGroupData.wrapperClass} radioGroup`}>
        {this.state.parsedRadioGroupData.titleObj && (
          <HelpText
            text={this.state.parsedRadioGroupData.titleObj.label}
            className={this.state.parsedRadioGroupData.titleObj.className}
          />
        )}
        <div aria-label={radioGroupData.ariaLabel}>
          {this.state.parsedRadioGroupData.radioItemList.map(radioData => {
            return (<Radio
              checked={radioData[valueKey] == (this.state.value || initialValue)}
              onChange={this.handleRadioChange}
              name={radioGroupData.name}
              value={radioData[valueKey]}
              label={
                <span
                  dangerouslySetInnerHTML={{
                    __html: radioData[labelKey]
                  }}
                />
              }
              key={radioData[valueKey]}
              labelPlacement={radioGroupData.labelPlacement}
              classes={{
                root: radioData.className || radioGroupData.className,
                label: "RadioGroup__Label"
              }}
              id={`privacy_${radioData[valueKey]}`}
            />
          )})
        }
        </div>
        {meta && meta.error && <p className="formError inline_error errorMargin">{meta.error}</p>}
      </fieldset>
    ) : (
      <Loading />
    );
  }
}

RadioGroup.defaultProps = {
  labelKey: "label",
  valueKey: "value"
};

export default RadioGroup;
